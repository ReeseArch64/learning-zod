import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { carregarExercicio, pegarFuncao, pegarSchema, pendente } from "./_ajuda.ts";

const arquivo = "12-aplicacao.ts";
const modulo = await carregarExercicio(arquivo);

type Env = { NODE_ENV: string; PORT: number; DATABASE_URL: string };

const bruto = {
  NODE_ENV: "production",
  PORT: "8080",
  DATABASE_URL: "https://banco.exemplo.com",
};

describe("Modulo 12: aplicacao pratica", { skip: modulo ? false : pendente(arquivo) }, () => {
  it("carrega variaveis de ambiente convertidas", () => {
    const carregarEnv = pegarFuncao<(bruto: unknown) => Env>(modulo, "carregarEnv", arquivo);
    const env = carregarEnv(bruto);
    assert.equal(env.NODE_ENV, "production");
    assert.equal(env.PORT, 8080, "PORT deve virar numero");
    assert.equal(env.DATABASE_URL, bruto.DATABASE_URL);
  });

  it("aplica os padroes de NODE_ENV e PORT", () => {
    const carregarEnv = pegarFuncao<(bruto: unknown) => Env>(modulo, "carregarEnv", arquivo);
    const env = carregarEnv({ DATABASE_URL: bruto.DATABASE_URL });
    assert.equal(env.NODE_ENV, "development", "NODE_ENV deve ter default development");
    assert.equal(env.PORT, 3000, "PORT deve ter default 3000");
  });

  it("lanca erro legivel quando falta uma variavel", () => {
    const carregarEnv = pegarFuncao<(bruto: unknown) => Env>(modulo, "carregarEnv", arquivo);
    assert.throws(
      () => carregarEnv({ NODE_ENV: "production" }),
      (erro: unknown) => {
        assert.ok(erro instanceof Error, "deve lancar um Error");
        assert.ok(erro.message.includes("DATABASE_URL"), "a mensagem deve citar DATABASE_URL");
        return true;
      },
    );
  });

  it("rejeita valores invalidos", () => {
    const carregarEnv = pegarFuncao<(bruto: unknown) => Env>(modulo, "carregarEnv", arquivo);
    assert.throws(() => carregarEnv({ ...bruto, NODE_ENV: "staging" }), "NODE_ENV fora do enum");
    assert.throws(() => carregarEnv({ ...bruto, DATABASE_URL: "nao-e-url" }), "DATABASE_URL invalida");
  });

  it("exporta o envSchema usado pela funcao", () => {
    const schema = pegarSchema(modulo, "envSchema", arquivo);
    assert.equal(schema.safeParse(bruto).success, true);
  });
});
