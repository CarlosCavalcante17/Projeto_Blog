import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ error: "O e-mail é obrigatório" })
    .email("E-mail com formato inválido")
    .meta({ example: "professor@blog.com" }),

  senha: z
    .string({ error: "A senha é obrigatória" })
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .meta({ example: "senhaForte123" }),
});

export type LoginInput = z.infer<typeof loginSchema>;
