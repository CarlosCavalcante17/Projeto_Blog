import { prisma } from "../config/prisma.js";
import type { AutorInput } from "@blog/shared/autor";

export async function findAll() {
  return await prisma.autor.findMany({ orderBy: { id: "asc" } });
  //SELECT * FROM autores ORDER BY id;
}

export async function findById(id: number) {
  return await prisma.autor.findUnique({ where: { id } });
  //SELECT * FROM autores WHERE id = ?;
}

export async function findByEmail(email: string) {
  return await prisma.autor.findUnique({ where: { email } });
  //SELECT * FROM autores WHERE email = ?;
}

export async function create(data: AutorInput) {
  return await prisma.autor.create({ data });
  //INSERT INTO autores (nome, email, bio) VALUES (?, ?, ?);
}

export async function update(id: number, data: AutorInput) {
  return await prisma.autor.update({ where: { id }, data });
  //UPDATE autores SET nome = ?, email = ?, bio = ? WHERE id = ?;
}

export async function remove(id: number) {
  return await prisma.autor.delete({ where: { id } });
  //DELETE FROM autores WHERE id = ?;
}
