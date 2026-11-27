import type { Request, Response } from "express";
import * as service from "../services/postService.js";
import type { PostInput } from "@blog/shared/post";

export async function listar(req: Request, res: Response) {
  const registros = await service.listarPosts();
  return res.json(registros);
}

export async function buscarPorId(req: Request, res: Response) {
  const id: number = Number(req.params.id);
  const registro = await service.encontrarUmPost(id);
  if (!registro) {
    return res.status(404).json({ mensagem: "Post não encontrado" });
  }
  return res.json(registro);
}

export async function cadastrar(req: Request, res: Response) {
  const dados: PostInput = req.body;
  const registro = await service.criarPost(dados);
  return res.status(201).json(registro);
}

export async function atualizar(req: Request, res: Response) {
  const id: number = Number(req.params.id);
  const dados: PostInput = req.body;
  const registro = await service.atualizarPost(id, dados);
  return res.json(registro);
}

export async function deletar(req: Request, res: Response) {
  const id: number = Number(req.params.id);
  await service.deletarPost(id);
  return res.status(204).send();
}
