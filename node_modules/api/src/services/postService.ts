import * as postRepository from "../repositories/postRepository.js";
import * as autorService from "./autorService.js";
import * as categoriaService from "./categoriaService.js";
import { ErroHttp } from "../erros.js";
import type { PostInput } from "@blog/shared/post";

// O autor e a categoria informados precisam existir
async function conferirLigadas(dados: PostInput) {
  const autor = await autorService.encontrarUmAutor(dados.autorId);
  if (!autor) {
    throw new ErroHttp(400, `Autor com ID ${dados.autorId} não encontrado.`);
  }
  const categoria = await categoriaService.encontrarUmCategoria(dados.categoriaId);
  if (!categoria) {
    throw new ErroHttp(400, `Categoria com ID ${dados.categoriaId} não encontrada.`);
  }
}

export async function listarPosts() {
  return await postRepository.findAll();
}

export async function encontrarUmPost(id: number) {
  return await postRepository.findById(id);
}

export async function criarPost(dados: PostInput) {
  await conferirLigadas(dados);
  return await postRepository.create(dados);
}

export async function atualizarPost(id: number, dados: PostInput) {
  const atual = await postRepository.findById(id);
  if (!atual) {
    throw new ErroHttp(404, "Post não encontrado.");
  }
  await conferirLigadas(dados);
  return await postRepository.update(id, dados);
}

export async function deletarPost(id: number): Promise<void> {
  const atual = await postRepository.findById(id);
  if (!atual) {
    throw new ErroHttp(404, "Post não encontrado.");
  }
  await postRepository.remove(id);
}
