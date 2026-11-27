import { z } from "zod";

// .meta() é do próprio Zod: o swagger da API lê o example daqui,
// sem que este pacote dependa de nada do backend.
export const usuarioSchema = z.object({
  nome: z
    .string({ error: "O nome é obrigatório" })
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres")
    .meta({ example: "Maria Oliveira" }),

  email: z
    .string({ error: "O e-mail é obrigatório" })
    .email("E-mail com formato inválido")
    .meta({ example: "maria@blog.com" }),
});

// Cadastro = dados do usuário + senha. A senha fica fora do usuarioSchema
// para nunca aparecer na resposta da API.
export const cadastroUsuarioSchema = usuarioSchema.extend({
  senha: z
    .string({ error: "A senha é obrigatória" })
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .max(72, "A senha deve ter no máximo 72 caracteres")
    .meta({ example: "senhaForte123" }),
});

export type UsuarioInput = z.infer<typeof usuarioSchema>;
export type CadastroUsuarioInput = z.infer<typeof cadastroUsuarioSchema>;

// Formato que a API devolve (sem senha)
export type Usuario = UsuarioInput & { id: number };
