import { z } from "zod";

export const querySchema = z.object({
  pagina: z.coerce.number().int().min(1, "Página deve ser maior ou igual a 1").default(1),
  limite: z.coerce.number().int().min(1, "Limite deve ser maior ou igual a 1").max(100, "Limite deve ser menor ou igual a 100").default(20),
  ativo: z.stringbool().default(false),
  desde: z.coerce.date().optional(),
})
