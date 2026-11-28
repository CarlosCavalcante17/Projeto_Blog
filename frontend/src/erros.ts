import axios from "axios";
import type { ZodType } from "zod";

export type ErrosDosCampos = Record<string, string>;

// Valida com o schema do shared (o mesmo da API) antes de chamar a API.
// Devolve os erros por campo, ou null se está tudo certo.
export function validarCampos(schema: ZodType, dados: unknown): ErrosDosCampos | null {
  const resultado = schema.safeParse(dados);
  if (resultado.success) return null;

  const porCampo: ErrosDosCampos = {};
  for (const problema of resultado.error.issues) {
    const campo = String(problema.path[0]);
    // guarda só a primeira mensagem de cada campo
    if (!porCampo[campo]) porCampo[campo] = problema.message;
  }
  return porCampo;
}

// Lê o erro que a API devolveu: uma mensagem geral e uma mensagem por campo
export function lerErroDaApi(e: unknown): { mensagem: string; porCampo: ErrosDosCampos } {
  if (axios.isAxiosError(e) && e.response) {
    const dados = e.response.data;
    const porCampo: ErrosDosCampos = {};
    if (dados?.detalhes) {
      for (const detalhe of dados.detalhes) porCampo[detalhe.campo] = detalhe.mensagem;
    }
    return { mensagem: dados?.mensagem ?? "Erro inesperado na API", porCampo };
  }
  // A API nem respondeu
  return { mensagem: "Não foi possível conectar à API. Ela está rodando?", porCampo: {} };
}
