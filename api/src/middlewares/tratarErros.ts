import type { Request, Response, NextFunction } from "express";
import { ErroHttp } from "../src/erros.js";

export function tratarErros(err: unknown, req: Request, res: Response, next: NextFunction) {
  void next;

  if (err instanceof ErroHttp) {
    return res.status(err.status).json({ mensagem: err.message });
  }

  if ((err as { type?: string }).type === "entity.parse.failed") {
    return res.status(400).json({ mensagem: "O corpo da requisição não é um JSON válido" });
  }

  const codigo = (err as { code?: string }).code;
  if (codigo === "P2002") {
    return res.status(409).json({ mensagem: "Já existe um registro com esse valor único" });
  }
  if (codigo === "P2025") {
    return res.status(404).json({ mensagem: "Registro não encontrado" });
  }
  if (codigo === "P2003") {
    return res.status(400).json({ mensagem: "Referência inválida: o registro ligado não existe" });
  }

  console.error(err);
  return res.status(500).json({ mensagem: "Erro interno do servidor" });
}
