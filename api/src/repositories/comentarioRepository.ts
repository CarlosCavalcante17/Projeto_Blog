import { prisma } from "../config/prisma.js";
import type { ComentarioInput } from "@blog/shared/comentario";

// Cada comentário vem com o id e o título do post a que pertence
const incluirPost = { post: { select: { id: true, titulo: true } } };

export async function findAll() {
  return await prisma.comentario.findMany({
    include: incluirPost,
    orderBy: { id: "asc" },
  });
  //SELECT c.*, p.id, p.titulo FROM comentarios c JOIN posts p ON c.post_id = p.id;
}

export async function findById(id: number) {
  return await prisma.comentario.findUnique({ where: { id }, include: incluirPost });
  //SELECT c.*, p.id, p.titulo FROM comentarios c JOIN posts p ON c.post_id = p.id WHERE c.id = ?;
}

export async function create(data: ComentarioInput) {
  return await prisma.comentario.create({ data, include: incluirPost });
  //INSERT INTO comentarios (leitor, texto, post_id) VALUES (?, ?, ?);
}

export async function update(id: number, data: ComentarioInput) {
  return await prisma.comentario.update({ where: { id }, data, include: incluirPost });
  //UPDATE comentarios SET leitor = ?, texto = ?, post_id = ? WHERE id = ?;
}

export async function remove(id: number) {
  return await prisma.comentario.delete({ where: { id } });
  //DELETE FROM comentarios WHERE id = ?;
}
