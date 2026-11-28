import { z } from "zod";

export const categoriaSchema = z.object({
  nome: z
    .string({ error: "O nome é obrigatório" })
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(50, "O nome deve ter no máximo 50 caracteres")
    .meta({ example: "Tecnologia" }),

  descricao: z
    .string({ error: "A descrição é obrigatória" })
    .min(5, "A descrição deve ter pelo menos 5 caracteres")
    .max(200, "A descrição deve ter no máximo 200 caracteres")
    .meta({ example: "Novidades, dicas e tutoriais de tecnologia." }),
});

export type CategoriaInput = z.infer<typeof categoriaSchema>;
export type Categoria = CategoriaInput & { id: number };
