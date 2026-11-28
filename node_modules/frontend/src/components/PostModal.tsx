import { useEffect, useState } from "react";
import { Alert, Button, Group, Modal, NativeSelect, Stack, Switch, TextInput, Textarea } from "@mantine/core";
import { postSchema, type Post } from "@blog/shared/post";
import type { Autor } from "@blog/shared/autor";
import type { Categoria } from "@blog/shared/categoria";
import { atualizarPost, cadastrarPost, listarAutores, listarCategorias } from "../services/api.ts";
import { lerErroDaApi, validarCampos, type ErrosDosCampos } from "../erros.ts";

type Props = {
  aberto: boolean;
  post: Post | null; // null = post novo; preenchido = editar
  onFechar: () => void;
  onSalvo: () => void;
};

export function PostModal({ aberto, post, onFechar, onSalvo }: Props) {
  // As listas dos selects, que vêm da API
  const [autores, setAutores] = useState<Autor[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  // O que a pessoa escolheu/digitou
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [publicado, setPublicado] = useState(false);
  const [autorId, setAutorId] = useState("");
  const [categoriaId, setCategoriaId] = useState("");

  const [erro, setErro] = useState("");
  const [erros, setErros] = useState<ErrosDosCampos>({});
  const [carregando, setCarregando] = useState(false);

  async function buscarListas() {
    try {
      setAutores(await listarAutores());
      setCategorias(await listarCategorias());
    } catch {
      setErro("Não foi possível buscar autores e categorias na API");
    }
  }

  // Busca autores e categorias toda vez que o modal abre (assim aparecem os recém-cadastrados)
  useEffect(() => {
    if (aberto) buscarListas();
  }, [aberto]);

  // Ao abrir para editar: preenche os campos com o post escolhido
  useEffect(() => {
    if (aberto && post) {
      setTitulo(post.titulo);
      setConteudo(post.conteudo);
      setPublicado(post.publicado);
      setAutorId(String(post.autorId));
      setCategoriaId(String(post.categoriaId));
    }
  }, [aberto, post]);

  function fechar() {
    // Limpa tudo para a próxima vez que o modal abrir
    setTitulo("");
    setConteudo("");
    setPublicado(false);
    setAutorId("");
    setCategoriaId("");
    setErro("");
    setErros({});
    onFechar();
  }

  async function salvar() {
    setErro("");
    setErros({});

    // O select guarda o id como texto ("3"); a API quer número (3)
    const dados = {
      titulo,
      conteudo,
      publicado,
      autorId: autorId === "" ? undefined : Number(autorId),
      categoriaId: categoriaId === "" ? undefined : Number(categoriaId),
    };
    const errosDeValidacao = validarCampos(postSchema, dados);
    if (errosDeValidacao) {
      setErros(errosDeValidacao);
      return;
    }

    setCarregando(true);
    try {
      const dadosValidos = { ...dados, autorId: Number(autorId), categoriaId: Number(categoriaId) };
      if (post) await atualizarPost(post.id, dadosValidos);
      else await cadastrarPost(dadosValidos);
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
    <Modal opened={aberto} onClose={fechar} title={post ? "Editar post" : "Novo post"} centered>
      <form
        onSubmit={(evento) => {
          evento.preventDefault();
          salvar();
        }}
      >
        <Stack>
          {erro && <Alert color="red">{erro}</Alert>}
          <TextInput label="Título" value={titulo} onChange={(evento) => setTitulo(evento.target.value)} error={erros.titulo} />
          <Textarea
            label="Conteúdo"
            autosize
            minRows={3}
            value={conteudo}
            onChange={(evento) => setConteudo(evento.target.value)}
            error={erros.conteudo}
          />
          <NativeSelect
            label="Autor"
            value={autorId}
            onChange={(evento) => setAutorId(evento.target.value)}
            error={erros.autorId}
            data={[
              { value: "", label: "Selecione o autor" },
              ...autores.map((autor) => ({ value: String(autor.id), label: autor.nome })),
            ]}
          />
          <NativeSelect
            label="Categoria"
            value={categoriaId}
            onChange={(evento) => setCategoriaId(evento.target.value)}
            error={erros.categoriaId}
            data={[
              { value: "", label: "Selecione a categoria" },
              ...categorias.map((categoria) => ({ value: String(categoria.id), label: categoria.nome })),
            ]}
          />
          <Switch
            label="Publicado"
            checked={publicado}
            onChange={(evento) => setPublicado(evento.currentTarget.checked)}
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
