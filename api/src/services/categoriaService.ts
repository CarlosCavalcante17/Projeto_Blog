import * as categoriaRepository from "../repositories/categoriaRepository.js";
import { ErroHttp } from "../src/erros.js";
import type { CategoriaInput } from "@blog/shared/categoria";

export async function listarCategorias() {
  return await categoriaRepository.findAll();
}

export async function encontrarUmCategoria(id: number) {
  return await categoriaRepository.findById(id);
}

export async function criarCategoria(dados: CategoriaInput) {
  const existente = await categoriaRepository.findByNome(dados.nome);
  if (existente) {
    throw new ErroHttp(409, "Já existe uma categoria com este nome.");
  }
  return await categoriaRepository.create(dados);
}

export async function atualizarCategoria(id: number, dados: CategoriaInput) {
  const atual = await categoriaRepository.findById(id);
  if (!atual) {
    throw new ErroHttp(404, "Categoria não encontrada.");
  }
  const comMesmoNome = await categoriaRepository.findByNome(dados.nome);
  if (comMesmoNome && comMesmoNome.id !== id) {
    throw new ErroHttp(409, "Já existe uma categoria com este nome.");
  }
  return await categoriaRepository.update(id, dados);
}

export async function deletarCategoria(id: number): Promise<void> {
  const atual = await categoriaRepository.findById(id);
  if (!atual) {
    throw new ErroHttp(404, "Categoria não encontrada.");
  }
  await categoriaRepository.remove(id);
}
