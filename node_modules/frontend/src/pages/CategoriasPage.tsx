import { useEffect, useState } from "react";
import { ActionIcon, Alert, Button, Group, Table, TextInput, Title } from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import type { Categoria } from "@blog/shared/categoria";
import { listarCategorias, removerCategoria } from "../services/api.ts";
import { lerErroDaApi } from "../erros.ts";
import { CategoriaModal } from "../components/CategoriaModal.tsx";

export function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [erro, setErro] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [emEdicao, setEmEdicao] = useState<Categoria | null>(null);
  const [busca, setBusca] = useState("");

  async function buscarCategorias() {
    setErro("");
    try {
      setCategorias(await listarCategorias());
    } catch {
      setErro("Não foi possível buscar as categorias na API");
    }
  }

  useEffect(() => {
    buscarCategorias();
  }, []);

  function abrirNova() {
    setEmEdicao(null);
    setModalAberto(true);
  }

  function abrirEdicao(categoria: Categoria) {
    setEmEdicao(categoria);
    setModalAberto(true);
  }

  async function remover(categoria: Categoria) {
    if (!confirm(`Remover a categoria ${categoria.nome}? Os posts dela também serão removidos.`)) return;
    try {
      await removerCategoria(categoria.id);
      await buscarCategorias();
    } catch (e) {
      setErro(lerErroDaApi(e).mensagem);
    }
  }

  const visiveis: Categoria[] = categorias.filter((categoria) =>
    categoria.nome.toLowerCase().includes(busca.toLowerCase()),
  );

  return (
    <>
      <Group justify="space-between" align="end" mb="xl">
        <Title order={1}>Categorias</Title>
        <Button onClick={abrirNova}>Nova categoria</Button>
      </Group>
      {erro && <Alert color="red" mb="md">{erro}</Alert>}
      <TextInput
        label="Buscar"
        placeholder="Nome da categoria"
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
              <Table.Th>Descrição</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {visiveis.map((categoria) => (
              <Table.Tr key={categoria.id}>
                <Table.Td>{categoria.nome}</Table.Td>
                <Table.Td>{categoria.descricao}</Table.Td>
                <Table.Td>
                  <Group gap={4} justify="flex-end" wrap="nowrap">
                    <ActionIcon variant="subtle" color="gray" aria-label="Editar" onClick={() => abrirEdicao(categoria)}>
                      <IconPencil size={18} />
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="red" aria-label="Remover" onClick={() => remover(categoria)}>
                      <IconTrash size={18} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      <CategoriaModal
        aberto={modalAberto}
        categoria={emEdicao}
        onFechar={() => setModalAberto(false)}
        onSalvo={buscarCategorias}
      />
    </>
  );
}
