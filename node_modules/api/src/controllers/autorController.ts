import type { Request, Response } from "express";
import * as service from "../services/autorService.js";
import type { AutorInput } from "@blog/shared/autor";

export async function listar(req: Request, res: Response) {
  const registros = await service.listarAutores();
  return res.json(registros);
}

export async function buscarPorId(req: Request, res: Response) {
  const id: number = Number(req.params.id);
  const registro = await service.encontrarUmAutor(id);
  if (!registro) {
    return res.status(404).json({ mensagem: "Autor não encontrado" });
  }
  return res.json(registro);
}

export async function cadastrar(req: Request, res: Response) {
  const dados: AutorInput = req.body;
  const registro = await service.criarAutor(dados);
  return res.status(201).json(registro);
}

export async function atualizar(req: Request, res: Response) {
  const id: number = Number(req.params.id);
  const dados: AutorInput = req.body;
  const registro = await service.atualizarAutor(id, dados);
  return res.json(registro);
}

export async function deletar(req: Request, res: Response) {
  const id: number = Number(req.params.id);
  await service.deletarAutor(id);
  return res.status(204).send();
}
