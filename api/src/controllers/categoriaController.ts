import type { Request, Response } from "express";
import * as service from "../services/categoriaService.js";
import type { CategoriaInput } from "@blog/shared/categoria";

export async function listar(req: Request, res: Response) {
  const registros = await service.listarCategorias();
  return res.json(registros);
}

export async function buscarPorId(req: Request, res: Response) {
  const id: number = Number(req.params.id);
  const registro = await service.encontrarUmCategoria(id);
  if (!registro) {
    return res.status(404).json({ mensagem: "Categoria não encontrada" });
  }
  return res.json(registro);
}

export async function cadastrar(req: Request, res: Response) {
  const dados: CategoriaInput = req.body;
  const registro = await service.criarCategoria(dados);
  return res.status(201).json(registro);
}

export async function atualizar(req: Request, res: Response) {
  const id: number = Number(req.params.id);
  const dados: CategoriaInput = req.body;
  const registro = await service.atualizarCategoria(id, dados);
  return res.json(registro);
}

export async function deletar(req: Request, res: Response) {
  const id: number = Number(req.params.id);
  await service.deletarCategoria(id);
  return res.status(204).send();
}
