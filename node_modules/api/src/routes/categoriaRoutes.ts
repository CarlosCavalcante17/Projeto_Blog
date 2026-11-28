import Router from "express";
import * as controller from "../controllers/categoriaController.js";
import { validarBody, validarId } from "../middlewares/validarSchema.js";
import { categoriaSchema } from "@blog/shared/categoria";

const router = Router();

router.get("/categorias", controller.listar);
router.get("/categorias/:id", validarId, controller.buscarPorId);
router.post("/categorias", validarBody(categoriaSchema), controller.cadastrar);
router.put("/categorias/:id", validarId, validarBody(categoriaSchema), controller.atualizar);
router.delete("/categorias/:id", validarId, controller.deletar);

export default router;
