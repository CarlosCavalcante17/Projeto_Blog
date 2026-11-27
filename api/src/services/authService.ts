import bcrypt from "bcryptjs";
import * as usuarioRepository from "../repositories/usuarioRepository.js";
import type { LoginInput } from "@blog/shared/auth";

// Devolve o usuário (sem senha) se e-mail e senha conferem; senão, null
export async function autenticar({ email, senha }: LoginInput) {
  const usuario = await usuarioRepository.findByEmailComSenha(email);
  if (!usuario) {
    return null;
  }

  const senhaConfere = await bcrypt.compare(senha, usuario.senha);
  if (!senhaConfere) {
    return null;
  }

  const { senha: _, ...usuarioSemSenha } = usuario;
  return usuarioSemSenha;
}
