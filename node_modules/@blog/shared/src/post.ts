import { z } from "zod";
import type { Autor } from "./autor.ts";
import type { Categoria } from "./categoria.ts";

export const postSchema = z.object({
  titulo: z
    .string({ error: "O título é obrigatório" })
    .min(3, "O título deve ter pelo menos 3 caracteres")
    .max(120, "O título deve ter no máximo 120 caracteres")
    .meta({ example: "Introdução ao Prisma" }),

  conteudo: z
    .string({ error: "O conteúdo é obrigatório" })
    .min(10, "O conteúdo deve ter pelo menos 10 caracteres")
    .meta({ example: "Neste post vamos ver como modelar um banco com o Prisma." }),

  publicado: z
    .boolean({ error: "O campo publicado deve ser verdadeiro ou falso" })
    .meta({ example: true }),

  autorId: z
    .number({ error: "O autor é obrigatório" })
    .int("O ID do autor deve ser um número inteiro")
    .positive("O ID do autor deve ser maior que zero")
    .meta({ example: 1 }),

  categoriaId: z
    .number({ error: "A categoria é obrigatória" })
    .int("O ID da categoria deve ser um número inteiro")
    .positive("O ID da categoria deve ser maior que zero")
    .meta({ example: 1 }),
});

export type PostInput = z.infer<typeof postSchema>;

// Formato que a API devolve: o post já vem com o autor e a categoria dentro
export type Post = PostInput & { id: number; autor: Autor; categoria: Categoria };
