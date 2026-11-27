import Router from "express";
import * as controller from "../controllers/usuarioController.js";
import { validarBody } from "../middlewares/validarSchema.js";
import { cadastroUsuarioSchema } from "@blog/shared/usuario";

const router = Router();

router.post("/usuarios", validarBody(cadastroUsuarioSchema), controller.cadastrar);

export default router;
