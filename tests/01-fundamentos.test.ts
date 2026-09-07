import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { aceita, carregarExercicio, pegarSchema, pendente, rejeita } from "./_ajuda.ts";

const arquivo = "01-fundamentos.ts";
const modulo = await carregarExercicio(arquivo);

describe("Modulo 1: fundamentos", { skip: modulo ? false : pendente(arquivo) }, () => {
  it("aceita uma configuracao valida", () => {
    const schema = pegarSchema(modulo, "configSchema", arquivo);
    const dados = aceita<{ host: string; porta: number; debug: boolean }>(
      schema,
      { host: "localhost", porta: 3000, debug: true },
      "config completa",
    );
    assert.deepEqual(dados, { host: "localhost", porta: 3000, debug: true });
  });

  it("aplica o valor padrao de debug", () => {
    const schema = pegarSchema(modulo, "configSchema", arquivo);
    const dados = aceita<{ debug: boolean }>(schema, { host: "localhost", porta: 3000 }, "config sem debug");
    assert.equal(dados.debug, false, "debug deve ter default false");
  });

  it("rejeita host vazio", () => {
    const schema = pegarSchema(modulo, "configSchema", arquivo);
    rejeita(schema, { host: "", porta: 3000 }, "host vazio");
  });

  it("rejeita portas fora do intervalo 1 a 65535", () => {
    const schema = pegarSchema(modulo, "configSchema", arquivo);
    rejeita(schema, { host: "localhost", porta: 0 }, "porta 0");
    rejeita(schema, { host: "localhost", porta: 70000 }, "porta 70000");
  });

  it("rejeita porta nao inteira", () => {
    const schema = pegarSchema(modulo, "configSchema", arquivo);
    rejeita(schema, { host: "localhost", porta: 3000.5 }, "porta decimal");
  });

  it("rejeita entrada que nao e objeto", () => {
    const schema = pegarSchema(modulo, "configSchema", arquivo);
    rejeita(schema, "localhost:3000", "string no lugar de objeto");
  });
});
