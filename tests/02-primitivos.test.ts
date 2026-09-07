import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { aceita, carregarExercicio, pegarSchema, pendente, rejeita } from "./_ajuda.ts";

const arquivo = "02-primitivos.ts";
const modulo = await carregarExercicio(arquivo);

type Query = { pagina: number; limite: number; ativo: boolean; desde?: Date };

describe("Modulo 2: primitivos e coercao", { skip: modulo ? false : pendente(arquivo) }, () => {
  it("converte texto em numero, booleano e data", () => {
    const schema = pegarSchema(modulo, "querySchema", arquivo);
    const dados = aceita<Query>(
      schema,
      { pagina: "2", limite: "50", ativo: "true", desde: "2024-01-02" },
      "query completa",
    );
    assert.equal(dados.pagina, 2);
    assert.equal(dados.limite, 50);
    assert.equal(dados.ativo, true);
    assert.ok(dados.desde instanceof Date, "desde deve virar Date");
  });

  it("aplica os valores padrao", () => {
    const schema = pegarSchema(modulo, "querySchema", arquivo);
    const dados = aceita<Query>(schema, {}, "query vazia");
    assert.equal(dados.pagina, 1, "pagina deve ter default 1");
    assert.equal(dados.limite, 20, "limite deve ter default 20");
    assert.equal(dados.ativo, false, "ativo deve ter default false");
  });

  it("rejeita valores fora das regras", () => {
    const schema = pegarSchema(modulo, "querySchema", arquivo);
    rejeita(schema, { pagina: "0" }, "pagina 0");
    rejeita(schema, { limite: "101" }, "limite 101");
    rejeita(schema, { ativo: "talvez" }, "ativo invalido");
  });
});
