import { useEffect, useState } from "react";
import { ActionIcon, Alert, Button, Group, Table, TextInput, Title } from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import type { Comentario } from "@blog/shared/comentario";
import { listarComentarios, removerComentario } from "../services/api.ts";
import { lerErroDaApi } from "../erros.ts";
import { ComentarioModal } from "../components/ComentarioModal.tsx";

export function ComentariosPage() {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [erro, setErro] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [emEdicao, setEmEdicao] = useState<Comentario | null>(null);
  const [busca, setBusca] = useState("");

  async function buscarComentarios() {
    setErro("");
    try {
      setComentarios(await listarComentarios());
    } catch {
      setErro("Não foi possível buscar os comentários na API");
    }
  }

  useEffect(() => {
    buscarComentarios();
  }, []);

  function abrirNovo() {
    setEmEdicao(null);
    setModalAberto(true);
  }

  function abrirEdicao(comentario: Comentario) {
    setEmEdicao(comentario);
    setModalAberto(true);
  }

  async function remover(comentario: Comentario) {
    if (!confirm(`Remover o comentário de ${comentario.leitor}?`)) return;
    try {
      await removerComentario(comentario.id);
      await buscarComentarios();
    } catch (e) {
      setErro(lerErroDaApi(e).mensagem);
    }
  }

  const visiveis: Comentario[] = comentarios.filter(
    (comentario) =>
      comentario.leitor.toLowerCase().includes(busca.toLowerCase()) ||
      comentario.texto.toLowerCase().includes(busca.toLowerCase()) ||
      comentario.post.titulo.toLowerCase().includes(busca.toLowerCase()),
  );

  return (
    <>
      <Group justify="space-between" align="end" mb="xl">
        <Title order={1}>Comentários</Title>
        <Button onClick={abrirNovo}>Novo comentário</Button>
      </Group>
      {erro && <Alert color="red" mb="md">{erro}</Alert>}
      <TextInput
        label="Buscar"
        placeholder="Leitor, texto ou título do post"
        value={busca}
        onChange={(evento) => setBusca(evento.target.value)}
        mb="md"
        maw={360}
      />
      <Table.ScrollContainer minWidth={560}>
        <Table bg="white" highlightOnHover verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Leitor</Table.Th>
              <Table.Th>Comentário</Table.Th>
              <Table.Th>Post</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {visiveis.map((comentario) => (
              <Table.Tr key={comentario.id}>
                <Table.Td>{comentario.leitor}</Table.Td>
                <Table.Td>{comentario.texto}</Table.Td>
                <Table.Td>{comentario.post.titulo}</Table.Td>
                <Table.Td>
                  <Group gap={4} justify="flex-end" wrap="nowrap">
                    <ActionIcon variant="subtle" color="gray" aria-label="Editar" onClick={() => abrirEdicao(comentario)}>
                      <IconPencil size={18} />
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="red" aria-label="Remover" onClick={() => remover(comentario)}>
                      <IconTrash size={18} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      <ComentarioModal
        aberto={modalAberto}
        comentario={emEdicao}
        onFechar={() => setModalAberto(false)}
        onSalvo={buscarComentarios}
      />
    </>
  );
}
