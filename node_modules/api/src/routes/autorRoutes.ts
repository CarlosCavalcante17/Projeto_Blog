import Router from "express";
import * as controller from "../controllers/autorController.js";
import { validarBody, validarId } from "../middlewares/validarSchema.js";
import { autorSchema } from "@blog/shared/autor";

const router = Router();

router.get("/autores", controller.listar);
router.get("/autores/:id", validarId, controller.buscarPorId);
router.post("/autores", validarBody(autorSchema), controller.cadastrar);
router.put("/autores/:id", validarId, validarBody(autorSchema), controller.atualizar);
router.delete("/autores/:id", validarId, controller.deletar);

export default router;
