import { useEffect, useState } from "react";
import { ActionIcon, Alert, Button, Group, Table, TextInput, Title } from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import type { Autor } from "@blog/shared/autor";
import { listarAutores, removerAutor } from "../services/api.ts";
import { lerErroDaApi } from "../erros.ts";
import { AutorModal } from "../components/AutorModal.tsx";

export function AutoresPage() {
  const [autores, setAutores] = useState<Autor[]>([]);
  const [erro, setErro] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  // Qual autor está sendo editado (null = novo autor)
  const [emEdicao, setEmEdicao] = useState<Autor | null>(null);
  // O que foi digitado na busca
  const [busca, setBusca] = useState("");

  async function buscarAutores() {
    setErro("");
    try {
      setAutores(await listarAutores());
    } catch {
      setErro("Não foi possível buscar os autores na API");
    }
  }

  useEffect(() => {
    buscarAutores();
  }, []); // executa uma única vez, quando a tela aparece

  function abrirNovo() {
    setEmEdicao(null);
    setModalAberto(true);
  }

  function abrirEdicao(autor: Autor) {
    setEmEdicao(autor);
    setModalAberto(true);
  }

  async function remover(autor: Autor) {
    // confirm() é do navegador: mostra a pergunta com OK e Cancelar
    if (!confirm(`Remover o autor ${autor.nome}? Os posts dele também serão removidos.`)) return;
    try {
      await removerAutor(autor.id);
      await buscarAutores();
    } catch (e) {
      setErro(lerErroDaApi(e).mensagem);
    }
  }

  // Não é um estado novo: é calculado a cada desenho, a partir da lista e da busca
  const visiveis: Autor[] = autores.filter(
    (autor) =>
      autor.nome.toLowerCase().includes(busca.toLowerCase()) ||
      autor.email.toLowerCase().includes(busca.toLowerCase()),
  );

  return (
    <>
      <Group justify="space-between" align="end" mb="xl">
        <Title order={1}>Autores</Title>
        <Button onClick={abrirNovo}>Novo autor</Button>
      </Group>
      {erro && <Alert color="red" mb="md">{erro}</Alert>}
      <TextInput
        label="Buscar"
        placeholder="Nome ou e-mail do autor"
        value={busca}
        onChange={(evento) => setBusca(evento.target.value)}
        mb="md"
        maw={360}
      />
      <Table.ScrollContainer minWidth={560}>
        <Table bg="white" highlightOnHover verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nome</Table.Th>
              <Table.Th>E-mail</Table.Th>
              <Table.Th>Bio</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {visiveis.map((autor) => (
              <Table.Tr key={autor.id}>
                <Table.Td>{autor.nome}</Table.Td>
                <Table.Td>{autor.email}</Table.Td>
                <Table.Td>{autor.bio}</Table.Td>
                <Table.Td>
                  <Group gap={4} justify="flex-end" wrap="nowrap">
                    <ActionIcon variant="subtle" color="gray" aria-label="Editar" onClick={() => abrirEdicao(autor)}>
                      <IconPencil size={18} />
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="red" aria-label="Remover" onClick={() => remover(autor)}>
                      <IconTrash size={18} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      <AutorModal
        aberto={modalAberto}
        autor={emEdicao}
        onFechar={() => setModalAberto(false)}
        onSalvo={buscarAutores}
      />
    </>
  );
}
