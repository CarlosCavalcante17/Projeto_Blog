import { z } from "zod";

export const autorSchema = z.object({
  nome: z
    .string({ error: "O nome é obrigatório" })
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres")
    .meta({ example: "Carlos Cavalcante" }),

  email: z
    .string({ error: "O e-mail é obrigatório" })
    .email("E-mail com formato inválido")
    .meta({ example: "carlos@blog.com" }),

  bio: z
    .string({ error: "A bio é obrigatória" })
    .min(5, "A bio deve ter pelo menos 5 caracteres")
    .max(300, "A bio deve ter no máximo 300 caracteres")
    .meta({ example: "Escreve sobre tecnologia e programação." }),
});

export type AutorInput = z.infer<typeof autorSchema>;
export type Autor = AutorInput & { id: number };
