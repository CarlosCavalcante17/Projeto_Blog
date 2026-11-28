import * as comentarioRepository from "../repositories/comentarioRepository.js";
import * as postService from "./postService.js";
import { ErroHttp } from "../erros.js";
import type { ComentarioInput } from "@blog/shared/comentario";

export async function listarComentarios() {
  return await comentarioRepository.findAll();
}

export async function encontrarUmComentario(id: number) {
  return await comentarioRepository.findById(id);
}

export async function criarComentario(dados: ComentarioInput) {
  const post = await postService.encontrarUmPost(dados.postId);
  if (!post) {
    throw new ErroHttp(400, `Post com ID ${dados.postId} não encontrado.`);
  }
  return await comentarioRepository.create(dados);
}

export async function atualizarComentario(id: number, dados: ComentarioInput) {
  const atual = await comentarioRepository.findById(id);
  if (!atual) {
    throw new ErroHttp(404, "Comentário não encontrado.");
  }
  const post = await postService.encontrarUmPost(dados.postId);
  if (!post) {
    throw new ErroHttp(400, `Post com ID ${dados.postId} não encontrado.`);
  }
  return await comentarioRepository.update(id, dados);
}

export async function deletarComentario(id: number): Promise<void> {
  const atual = await comentarioRepository.findById(id);
  if (!atual) {
    throw new ErroHttp(404, "Comentário não encontrado.");
  }
  await comentarioRepository.remove(id);
}
