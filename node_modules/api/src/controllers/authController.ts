import type { Request, Response } from "express";
import * as service from "../services/authService.js";
import type { LoginInput } from "@blog/shared/auth";

export async function login(req: Request, res: Response) {
  const dados: LoginInput = req.body;
  const usuario = await service.autenticar(dados);
  if (!usuario) {
    // Mesma mensagem para e-mail inexistente e senha errada: não revela qual dos dois falhou
    return res.status(401).json({ mensagem: "E-mail ou senha inválidos" });
  }
  return res.json(usuario);
}
