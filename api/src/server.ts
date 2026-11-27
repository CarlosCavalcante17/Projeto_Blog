import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../config/swagger.js";
import { tratarErros } from "../middlewares/tratarErros.js";

import autorRoutes from "../routes/autorRoutes.js";
import categoriaRoutes from "../routes/categoriaRoutes.js";
import postRoutes from "../routes/postRoutes.js";
import comentarioRoutes from "../routes/comentarioRoutes.js";
import usuarioRoutes from "../routes/usuarioRoutes.js";
import authRoutes from "../routes/authRoutes.js";

dotenv.config();

const app = express();

// Libera o front (outra origem: porta 5173) para chamar a API pelo navegador
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

const PORT: number = Number(process.env.PORT || 3000);

// Documentação interativa Swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas da aplicação
app.use(autorRoutes);
app.use(categoriaRoutes);
app.use(postRoutes);
app.use(comentarioRoutes);
app.use(usuarioRoutes);
app.use(authRoutes);

// Middleware global de tratamento de erros (sempre por último)
app.use(tratarErros);

app.listen(PORT, () => {
  console.log(`A API subiu na porta ${PORT}`);
  console.log(`Documentação disponível em: http://localhost:${PORT}/docs`);
});
