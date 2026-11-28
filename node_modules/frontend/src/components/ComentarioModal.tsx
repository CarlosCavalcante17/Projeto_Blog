import { useEffect, useState } from "react";
import { Alert, Button, Group, Modal, NativeSelect, Stack, TextInput, Textarea } from "@mantine/core";
import { comentarioSchema, type Comentario } from "@blog/shared/comentario";
import type { Post } from "@blog/shared/post";
import { atualizarComentario, cadastrarComentario, listarPosts } from "../services/api.ts";
import { lerErroDaApi, validarCampos, type ErrosDosCampos } from "../erros.ts";

type Props = {
  aberto: boolean;
  comentario: Comentario | null; // null = comentário novo; preenchido = editar
  onFechar: () => void;
  onSalvo: () => void;
};

export function ComentarioModal({ aberto, comentario, onFechar, onSalvo }: Props) {
  // A lista do select, que vem da API
  const [posts, setPosts] = useState<Post[]>([]);

  const [leitor, setLeitor] = useState("");
  const [texto, setTexto] = useState("");
  const [postId, setPostId] = useState("");

  const [erro, setErro] = useState("");
  const [erros, setErros] = useState<ErrosDosCampos>({});
  const [carregando, setCarregando] = useState(false);

  async function buscarPosts() {
    try {
      setPosts(await listarPosts());
    } catch {
      setErro("Não foi possível buscar os posts na API");
    }
  }

  // Busca os posts toda vez que o modal abre
  useEffect(() => {
    if (aberto) buscarPosts();
  }, [aberto]);

  // Ao abrir para editar: preenche os campos com o comentário escolhido
  useEffect(() => {
    if (aberto && comentario) {
      setLeitor(comentario.leitor);
      setTexto(comentario.texto);
      setPostId(String(comentario.postId));
    }
  }, [aberto, comentario]);

  function fechar() {
    setLeitor("");
    setTexto("");
    setPostId("");
    setErro("");
    setErros({});
    onFechar();
  }

  async function salvar() {
    setErro("");
    setErros({});

    // O select guarda o id como texto ("3"); a API quer número (3)
    const dados = { leitor, texto, postId: postId === "" ? undefined : Number(postId) };
    const errosDeValidacao = validarCampos(comentarioSchema, dados);
    if (errosDeValidacao) {
      setErros(errosDeValidacao);
      return;
    }

    setCarregando(true);
    try {
      const dadosValidos = { leitor, texto, postId: Number(postId) };
      if (comentario) await atualizarComentario(comentario.id, dadosValidos);
      else await cadastrarComentario(dadosValidos);
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
    <Modal opened={aberto} onClose={fechar} title={comentario ? "Editar comentário" : "Novo comentário"} centered>
      <form
        onSubmit={(evento) => {
          evento.preventDefault();
          salvar();
        }}
      >
        <Stack>
          {erro && <Alert color="red">{erro}</Alert>}
          <NativeSelect
            label="Post"
            value={postId}
            onChange={(evento) => setPostId(evento.target.value)}
            error={erros.postId}
            data={[
              { value: "", label: "Selecione o post" },
              ...posts.map((post) => ({ value: String(post.id), label: post.titulo })),
            ]}
          />
          <TextInput label="Leitor" value={leitor} onChange={(evento) => setLeitor(evento.target.value)} error={erros.leitor} />
          <Textarea label="Comentário" autosize minRows={3} value={texto} onChange={(evento) => setTexto(evento.target.value)} error={erros.texto} />
          <Group justify="flex-end">
            <Button variant="default" onClick={fechar}>Cancelar</Button>
            <Button type="submit" loading={carregando}>Salvar</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
