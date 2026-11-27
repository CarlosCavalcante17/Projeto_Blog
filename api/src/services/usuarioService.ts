import bcrypt from "bcryptjs";
import * as usuarioRepository from "../repositories/usuarioRepository.js";
import { ErroHttp } from "../src/erros.js";
import type { CadastroUsuarioInput } from "@blog/shared/usuario";

const SALT_ROUNDS = 10;

export async function criarUsuario(dados: CadastroUsuarioInput) {
  const existente = await usuarioRepository.findByEmail(dados.email);
  if (existente) {
    throw new ErroHttp(409, "Já existe um usuário cadastrado com este e-mail.");
  }
  // Nunca guardamos a senha em texto puro: o banco recebe só o hash
  const senhaHash = await bcrypt.hash(dados.senha, SALT_ROUNDS);
  // O omit global em config/prisma.ts tira a senha do retorno
  return await usuarioRepository.create({ ...dados, senha: senhaHash });
}
