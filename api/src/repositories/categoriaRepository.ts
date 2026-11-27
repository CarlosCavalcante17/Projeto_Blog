import { prisma } from "../config/prisma.js";
import type { CategoriaInput } from "@blog/shared/categoria";

export async function findAll() {
  return await prisma.categoria.findMany({ orderBy: { id: "asc" } });
  //SELECT * FROM categorias ORDER BY id;
}

export async function findById(id: number) {
  return await prisma.categoria.findUnique({ where: { id } });
  //SELECT * FROM categorias WHERE id = ?;
}

export async function findByNome(nome: string) {
  return await prisma.categoria.findUnique({ where: { nome } });
  //SELECT * FROM categorias WHERE nome = ?;
}

export async function create(data: CategoriaInput) {
  return await prisma.categoria.create({ data });
  //INSERT INTO categorias (nome, descricao) VALUES (?, ?);
}

export async function update(id: number, data: CategoriaInput) {
  return await prisma.categoria.update({ where: { id }, data });
  //UPDATE categorias SET nome = ?, descricao = ? WHERE id = ?;
}

export async function remove(id: number) {
  return await prisma.categoria.delete({ where: { id } });
  //DELETE FROM categorias WHERE id = ?;
}
