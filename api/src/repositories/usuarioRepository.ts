import { prisma } from "../config/prisma.js";
import type { CadastroUsuarioInput } from "@blog/shared/usuario";

export async function findByEmail(email: string) {
  return await prisma.usuario.findUnique({ where: { email } });
  //SELECT id, nome, email FROM usuarios WHERE email = ?;
}

export async function create(data: CadastroUsuarioInput) {
  return await prisma.usuario.create({ data });
  //INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?);
}

// Única consulta que traz o hash da senha (o omit global esconde nas outras)
export async function findByEmailComSenha(email: string) {
  return await prisma.usuario.findUnique({
    where: { email },
    omit: { senha: false },
  });
  //SELECT * FROM usuarios WHERE email = ?;
}
