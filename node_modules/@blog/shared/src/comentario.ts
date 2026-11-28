import { z } from "zod";
import type { Post } from "./post.ts";

export const comentarioSchema = z.object({
  leitor: z
    .string({ error: "O nome do leitor é obrigatório" })
    .min(2, "O nome do leitor deve ter pelo menos 2 caracteres")
    .max(100, "O nome do leitor deve ter no máximo 100 caracteres")
    .meta({ example: "Ana Beatriz" }),

  texto: z
    .string({ error: "O comentário é obrigatório" })
    .min(2, "O comentário deve ter pelo menos 2 caracteres")
    .max(1000, "O comentário deve ter no máximo 1000 caracteres")
    .meta({ example: "Ótimo post, me ajudou bastante!" }),

  postId: z
    .number({ error: "O post é obrigatório" })
    .int("O ID do post deve ser um número inteiro")
    .positive("O ID do post deve ser maior que zero")
    .meta({ example: 1 }),
});

export type ComentarioInput = z.infer<typeof comentarioSchema>;

// Formato que a API devolve: o comentário já vem com o post (título) dentro
export type Comentario = ComentarioInput & { id: number; post: Pick<Post, "id" | "titulo"> };
