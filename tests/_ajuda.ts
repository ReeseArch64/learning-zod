import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import assert from "node:assert/strict";
import { z } from "zod";

const raizSrc = path.resolve(fileURLToPath(new URL("../src", import.meta.url)));

export type Modulo = Record<string, unknown>;

export async function carregarExercicio(arquivo: string): Promise<Modulo | null> {
  const destino = path.join(raizSrc, arquivo);
  if (!existsSync(destino)) return null;
  const url = pathToFileURL(destino).href;
  const carregado: unknown = await import(url);
  return carregado as Modulo;
}

export function pendente(arquivo: string): string {
  return `Exercicio pendente: crie src/${arquivo} conforme lesson.md`;
}

export function pegarExport<T>(modulo: Modulo | null, nome: string, arquivo: string): T {
  assert.ok(modulo, pendente(arquivo));
  const valor = modulo[nome];
  assert.notEqual(valor, undefined, `src/${arquivo} deve exportar "${nome}".`);
  return valor as T;
}

export function pegarSchema(modulo: Modulo | null, nome: string, arquivo: string): z.ZodType {
  const valor = pegarExport<unknown>(modulo, nome, arquivo);
  assert.ok(valor instanceof z.ZodType, `"${nome}" em src/${arquivo} deve ser um schema Zod.`);
  return valor;
}

export function pegarFuncao<T extends (...args: never[]) => unknown>(
  modulo: Modulo | null,
  nome: string,
  arquivo: string,
): T {
  const valor = pegarExport<unknown>(modulo, nome, arquivo);
  assert.equal(typeof valor, "function", `"${nome}" em src/${arquivo} deve ser uma funcao.`);
  return valor as T;
}

export function aceita<T>(schema: z.ZodType, entrada: unknown, contexto: string): T {
  const resultado = schema.safeParse(entrada);
  assert.ok(
    resultado.success,
    `${contexto}: deveria ser valido, mas falhou com\n${resultado.success ? "" : z.prettifyError(resultado.error)}`,
  );
  return resultado.data as T;
}

export function rejeita(schema: z.ZodType, entrada: unknown, contexto: string): z.ZodError {
  const resultado = schema.safeParse(entrada);
  assert.ok(!resultado.success, `${contexto}: deveria ser invalido, mas passou na validacao.`);
  return resultado.error;
}

export function campos(erro: z.ZodError): Record<string, string[]> {
  const plano = z.flattenError(erro);
  return plano.fieldErrors as Record<string, string[]>;
}
