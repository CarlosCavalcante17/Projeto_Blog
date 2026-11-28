import Router from "express";
import * as controller from "../controllers/comentarioController.js";
import { validarBody, validarId } from "../middlewares/validarSchema.js";
import { comentarioSchema } from "@blog/shared/comentario";

const router = Router();

router.get("/comentarios", controller.listar);
router.get("/comentarios/:id", validarId, controller.buscarPorId);
router.post("/comentarios", validarBody(comentarioSchema), controller.cadastrar);
router.put("/comentarios/:id", validarId, validarBody(comentarioSchema), controller.atualizar);
router.delete("/comentarios/:id", validarId, controller.deletar);

export default router;
