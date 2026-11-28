import type { Request, Response } from "express";
import * as service from "../services/comentarioService.js";
import type { ComentarioInput } from "@blog/shared/comentario";

export async function listar(req: Request, res: Response) {
  const registros = await service.listarComentarios();
  return res.json(registros);
}

export async function buscarPorId(req: Request, res: Response) {
  const id: number = Number(req.params.id);
  const registro = await service.encontrarUmComentario(id);
  if (!registro) {
    return res.status(404).json({ mensagem: "Comentário não encontrado" });
  }
  return res.json(registro);
}

export async function cadastrar(req: Request, res: Response) {
  const dados: ComentarioInput = req.body;
  const registro = await service.criarComentario(dados);
  return res.status(201).json(registro);
}

export async function atualizar(req: Request, res: Response) {
  const id: number = Number(req.params.id);
  const dados: ComentarioInput = req.body;
  const registro = await service.atualizarComentario(id, dados);
  return res.json(registro);
}

export async function deletar(req: Request, res: Response) {
  const id: number = Number(req.params.id);
  await service.deletarComentario(id);
  return res.status(204).send();
}
