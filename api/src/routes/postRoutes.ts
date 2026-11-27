import Router from "express";
import * as controller from "../controllers/postController.js";
import { validarBody, validarId } from "../middlewares/validarSchema.js";
import { postSchema } from "@blog/shared/post";

const router = Router();

router.get("/posts", controller.listar);
router.get("/posts/:id", validarId, controller.buscarPorId);
router.post("/posts", validarBody(postSchema), controller.cadastrar);
router.put("/posts/:id", validarId, validarBody(postSchema), controller.atualizar);
router.delete("/posts/:id", validarId, controller.deletar);

export default router;
