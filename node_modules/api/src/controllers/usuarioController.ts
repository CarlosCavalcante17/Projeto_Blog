import type { Request, Response } from "express";
import * as service from "../services/usuarioService.js";
import type { CadastroUsuarioInput } from "@blog/shared/usuario";

export async function cadastrar(req: Request, res: Response) {
  const dados: CadastroUsuarioInput = req.body;
  const usuario = await service.criarUsuario(dados);
  return res.status(201).json(usuario);
}
