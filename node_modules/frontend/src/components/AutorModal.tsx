import { useEffect, useState } from "react";
import { Alert, Button, Group, Modal, Stack, TextInput, Textarea } from "@mantine/core";
import { autorSchema, type Autor } from "@blog/shared/autor";
import { atualizarAutor, cadastrarAutor } from "../services/api.ts";
import { lerErroDaApi, validarCampos, type ErrosDosCampos } from "../erros.ts";

type Props = {
  aberto: boolean;
  autor: Autor | null; // null = autor novo; preenchido = editar
  onFechar: () => void;
  onSalvo: () => void;
};

export function AutorModal({ aberto, autor, onFechar, onSalvo }: Props) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");

  const [erro, setErro] = useState("");
  const [erros, setErros] = useState<ErrosDosCampos>({});
  const [carregando, setCarregando] = useState(false);

  // Ao abrir para editar: preenche os campos com o autor escolhido
  useEffect(() => {
    if (aberto && autor) {
      setNome(autor.nome);
      setEmail(autor.email);
      setBio(autor.bio);
    }
  }, [aberto, autor]);

  function fechar() {
    // Limpa tudo para a próxima vez que o modal abrir
    setNome("");
    setEmail("");
    setBio("");
    setErro("");
    setErros({});
    onFechar();
  }

  async function salvar() {
    setErro("");
    setErros({});

    const dados = { nome, email, bio };
    const errosDeValidacao = validarCampos(autorSchema, dados);
    if (errosDeValidacao) {
      setErros(errosDeValidacao);
      return;
    }

    setCarregando(true);
    try {
      if (autor) await atualizarAutor(autor.id, dados);
      else await cadastrarAutor(dados);
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
    <Modal opened={aberto} onClose={fechar} title={autor ? "Editar autor" : "Novo autor"} centered>
      <form
        onSubmit={(evento) => {
          evento.preventDefault();
          salvar();
        }}
      >
        <Stack>
          {erro && <Alert color="red">{erro}</Alert>}
          <TextInput label="Nome" value={nome} onChange={(evento) => setNome(evento.target.value)} error={erros.nome} />
          <TextInput label="E-mail" value={email} onChange={(evento) => setEmail(evento.target.value)} error={erros.email} />
          <Textarea label="Bio" autosize minRows={2} value={bio} onChange={(evento) => setBio(evento.target.value)} error={erros.bio} />
          <Group justify="flex-end">
            <Button variant="default" onClick={fechar}>Cancelar</Button>
            <Button type="submit" loading={carregando}>Salvar</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
