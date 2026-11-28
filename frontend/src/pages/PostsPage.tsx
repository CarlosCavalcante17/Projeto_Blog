import { useEffect, useState } from "react";
import { ActionIcon, Alert, Badge, Button, Group, Table, TextInput, Title } from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import type { Post } from "@blog/shared/post";
import { listarPosts, removerPost } from "../services/api.ts";
import { lerErroDaApi } from "../erros.ts";
import { PostModal } from "../components/PostModal.tsx";

export function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [erro, setErro] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  // Qual post está sendo editado (null = novo post)
  const [emEdicao, setEmEdicao] = useState<Post | null>(null);
  // O que foi digitado na busca
  const [busca, setBusca] = useState("");

  async function buscarPosts() {
    setErro("");
    try {
      setPosts(await listarPosts());
    } catch {
      setErro("Não foi possível buscar os posts na API");
    }
  }

  useEffect(() => {
    buscarPosts();
  }, []); // executa uma única vez, quando a tela aparece

  function abrirNovo() {
    setEmEdicao(null); // não estou editando um post, mas criando do zero
    setModalAberto(true);
  }

  function abrirEdicao(post: Post) {
    setEmEdicao(post); // o post já existe, então vamos editar
    setModalAberto(true);
  }

  async function remover(post: Post) {
    // confirm() é do navegador: mostra a pergunta com OK e Cancelar
    if (!confirm(`Remover o post "${post.titulo}"? Os comentários dele também serão removidos.`)) return;
    try {
      await removerPost(post.id);
      await buscarPosts();
    } catch (e) {
      setErro(lerErroDaApi(e).mensagem);
    }
  }

  // Não é um estado novo: é calculado a cada desenho, a partir da lista e da busca
  const visiveis: Post[] = posts.filter(
    (post) =>
      post.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      post.autor.nome.toLowerCase().includes(busca.toLowerCase()) ||
      post.categoria.nome.toLowerCase().includes(busca.toLowerCase()),
  );

  return (
    <>
      <Group justify="space-between" align="end" mb="xl">
        <Title order={1}>Posts</Title>
        <Button onClick={abrirNovo}>Novo post</Button>
      </Group>
      {erro && <Alert color="red" mb="md">{erro}</Alert>}
      <TextInput
        label="Buscar"
        placeholder="Título, autor ou categoria"
        value={busca}
        onChange={(evento) => setBusca(evento.target.value)}
        mb="md"
        maw={360}
      />
      <Table.ScrollContainer minWidth={560}>
        <Table bg="white" highlightOnHover verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Título</Table.Th>
              <Table.Th>Autor</Table.Th>
              <Table.Th>Categoria</Table.Th>
              <Table.Th>Situação</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {visiveis.map((post) => (
              <Table.Tr key={post.id}>
                <Table.Td>{post.titulo}</Table.Td>
                <Table.Td>{post.autor.nome}</Table.Td>
                <Table.Td>{post.categoria.nome}</Table.Td>
                <Table.Td>
                  <Badge color={post.publicado ? "green" : "gray"} variant="light">
                    {post.publicado ? "Publicado" : "Rascunho"}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap={4} justify="flex-end" wrap="nowrap">
                    <ActionIcon variant="subtle" color="gray" aria-label="Editar" onClick={() => abrirEdicao(post)}>
                      <IconPencil size={18} />
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="red" aria-label="Remover" onClick={() => remover(post)}>
                      <IconTrash size={18} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      <PostModal
        aberto={modalAberto}
        post={emEdicao}
        onFechar={() => setModalAberto(false)}
        onSalvo={buscarPosts}
      />
    </>
  );
}
