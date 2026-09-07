import { z } from "zod";

export const configSchema = z.object({
  host: z.string().nonempty("Host é obrigatório").default("localhost"),
  porta: z.number().int().min(1).max(65535).default(3000),
  debug: z.boolean().default(false),
})
