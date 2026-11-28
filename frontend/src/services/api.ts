import axios from "axios";
import type { Autor, AutorInput } from "@blog/shared/autor";
import type { Categoria, CategoriaInput } from "@blog/shared/categoria";
import type { Post, PostInput } from "@blog/shared/post";
import type { Comentario, ComentarioInput } from "@blog/shared/comentario";
import type { CadastroUsuarioInput, Usuario } from "@blog/shared/usuario";
import type { LoginInput } from "@blog/shared/auth";

// Todas as chamadas vão para a nossa API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
});

// ---------- Usuário ----------
export async function login(dados: LoginInput): Promise<Usuario> {
  const resposta = await api.post("/auth/login", dados);
  return resposta.data;
}

export async function cadastrarUsuario(dados: CadastroUsuarioInput): Promise<Usuario> {
  const resposta = await api.post("/usuarios", dados);
  return resposta.data;
}

// ---------- Autores ----------
export async function listarAutores(): Promise<Autor[]> {
  const resposta = await api.get("/autores");
  return resposta.data;
}

export async function cadastrarAutor(autor: AutorInput) {
  const resposta = await api.post("/autores", autor);
  return resposta.data;
}

export async function atualizarAutor(id: number, autor: AutorInput) {
  const resposta = await api.put(`/autores/${id}`, autor);
  return resposta.data;
}

export async function removerAutor(id: number) {
  await api.delete(`/autores/${id}`);
}

// ---------- Categorias ----------
export async function listarCategorias(): Promise<Categoria[]> {
  const resposta = await api.get("/categorias");
  return resposta.data;
}

export async function cadastrarCategoria(categoria: CategoriaInput) {
  const resposta = await api.post("/categorias", categoria);
  return resposta.data;
}

export async function atualizarCategoria(id: number, categoria: CategoriaInput) {
  const resposta = await api.put(`/categorias/${id}`, categoria);
  return resposta.data;
}

export async function removerCategoria(id: number) {
  await api.delete(`/categorias/${id}`);
}

// ---------- Posts ----------
export async function listarPosts(): Promise<Post[]> {
  const resposta = await api.get("/posts");
  return resposta.data;
}

export async function cadastrarPost(post: PostInput) {
  const resposta = await api.post("/posts", post);
  return resposta.data;
}

export async function atualizarPost(id: number, post: PostInput) {
  const resposta = await api.put(`/posts/${id}`, post);
  return resposta.data;
}

export async function removerPost(id: number) {
  await api.delete(`/posts/${id}`);
}

// ---------- Comentários ----------
export async function listarComentarios(): Promise<Comentario[]> {
  const resposta = await api.get("/comentarios");
  return resposta.data;
}

export async function cadastrarComentario(comentario: ComentarioInput) {
  const resposta = await api.post("/comentarios", comentario);
  return resposta.data;
}

export async function atualizarComentario(id: number, comentario: ComentarioInput) {
  const resposta = await api.put(`/comentarios/${id}`, comentario);
  return resposta.data;
}

export async function removerComentario(id: number) {
  await api.delete(`/comentarios/${id}`);
}
