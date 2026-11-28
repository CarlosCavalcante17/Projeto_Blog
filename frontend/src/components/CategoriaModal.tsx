import { useEffect, useState } from "react";
import { Alert, Button, Group, Modal, Stack, TextInput, Textarea } from "@mantine/core";
import { categoriaSchema, type Categoria } from "@blog/shared/categoria";
import { atualizarCategoria, cadastrarCategoria } from "../services/api.ts";
import { lerErroDaApi, validarCampos, type ErrosDosCampos } from "../erros.ts";

type Props = {
  aberto: boolean;
  categoria: Categoria | null; // null = categoria nova; preenchida = editar
  onFechar: () => void;
  onSalvo: () => void;
};

export function CategoriaModal({ aberto, categoria, onFechar, onSalvo }: Props) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  const [erro, setErro] = useState("");
  const [erros, setErros] = useState<ErrosDosCampos>({});
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (aberto && categoria) {
      setNome(categoria.nome);
      setDescricao(categoria.descricao);
    }
  }, [aberto, categoria]);

  function fechar() {
    setNome("");
    setDescricao("");
    setErro("");
    setErros({});
    onFechar();
  }

  async function salvar() {
    setErro("");
    setErros({});

    const dados = { nome, descricao };
    const errosDeValidacao = validarCampos(categoriaSchema, dados);
    if (errosDeValidacao) {
      setErros(errosDeValidacao);
      return;
    }

    setCarregando(true);
    try {
      if (categoria) await atualizarCategoria(categoria.id, dados);
      else await cadastrarCategoria(dados);
      onSalvo();
      fechar();
    } catch (e) {
      const { mensagem, porCampo } = lerErroDaApi(e);
      setErro(mensagem);
      setErros(porCampo);
    }
    setCarregando(false);
  }

  return (
    <Modal opened={aberto} onClose={fechar} title={categoria ? "Editar categoria" : "Nova categoria"} centered>
      <form
        onSubmit={(evento) => {
          evento.preventDefault();
          salvar();
        }}
      >
        <Stack>
          {erro && <Alert color="red">{erro}</Alert>}
          <TextInput label="Nome" value={nome} onChange={(evento) => setNome(evento.target.value)} error={erros.nome} />
          <Textarea
            label="Descrição"
            autosize
            minRows={2}
            value={descricao}
            onChange={(evento) => setDescricao(evento.target.value)}
            error={erros.descricao}
          />
          <Group justify="flex-end">
            <Button variant="default" onClick={fechar}>Cancelar</Button>
            <Button type="submit" loading={carregando}>Salvar</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
