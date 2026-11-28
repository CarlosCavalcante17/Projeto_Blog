import * as autorRepository from "../repositories/autorRepository.js";
import { ErroHttp } from "../erros.js";
import type { AutorInput } from "@blog/shared/autor";

export async function listarAutores() {
  return await autorRepository.findAll();
}

export async function encontrarUmAutor(id: number) {
  return await autorRepository.findById(id);
}

export async function criarAutor(dados: AutorInput) {
  const existente = await autorRepository.findByEmail(dados.email);
  if (existente) {
    throw new ErroHttp(409, "Já existe um autor cadastrado com este e-mail.");
  }
  return await autorRepository.create(dados);
}

export async function atualizarAutor(id: number, dados: AutorInput) {
  const atual = await autorRepository.findById(id);
  if (!atual) {
    throw new ErroHttp(404, "Autor não encontrado.");
  }
  // O e-mail pode ser o do próprio autor; só é erro se for de outro
  const comMesmoEmail = await autorRepository.findByEmail(dados.email);
  if (comMesmoEmail && comMesmoEmail.id !== id) {
    throw new ErroHttp(409, "Já existe um autor cadastrado com este e-mail.");
  }
  return await autorRepository.update(id, dados);
}

export async function deletarAutor(id: number): Promise<void> {
  const atual = await autorRepository.findById(id);
  if (!atual) {
    throw new ErroHttp(404, "Autor não encontrado.");
  }
  await autorRepository.remove(id);
}
