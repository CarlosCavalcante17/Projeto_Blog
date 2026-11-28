import { prisma } from "../config/prisma.js";
import type { PostInput } from "@blog/shared/post";

// A lista traz o autor e a categoria dentro de cada post (include = JOIN)
const incluirLigadas = { autor: true, categoria: true };

export async function findAll() {
  return await prisma.post.findMany({
    include: incluirLigadas,
    orderBy: { id: "asc" },
  });
  //SELECT p.*, a.*, c.* FROM posts p
  //JOIN autores a ON p.autor_id = a.id
  //JOIN categorias c ON p.categoria_id = c.id;
}

export async function findById(id: number) {
  return await prisma.post.findUnique({
    where: { id },
    include: incluirLigadas,
  });
  //SELECT p.*, a.*, c.* FROM posts p
  //JOIN autores a ON p.autor_id = a.id
  //JOIN categorias c ON p.categoria_id = c.id
  //WHERE p.id = ?;
}

export async function create(data: PostInput) {
  return await prisma.post.create({ data, include: incluirLigadas });
  //INSERT INTO posts (titulo, conteudo, publicado, autor_id, categoria_id) VALUES (?, ?, ?, ?, ?);
}

export async function update(id: number, data: PostInput) {
  return await prisma.post.update({ where: { id }, data, include: incluirLigadas });
  //UPDATE posts SET titulo = ?, conteudo = ?, publicado = ?, autor_id = ?, categoria_id = ? WHERE id = ?;
}

export async function remove(id: number) {
  return await prisma.post.delete({ where: { id } });
  //DELETE FROM posts WHERE id = ?;
}
