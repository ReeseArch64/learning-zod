import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { aceita, carregarExercicio, pegarSchema, pendente, rejeita } from "./_ajuda.ts";

const arquivo = "05-colecoes.ts";
const modulo = await carregarExercicio(arquivo);

describe("Modulo 5: colecoes", { skip: modulo ? false : pendente(arquivo) }, () => {
  it("estoqueSchema aceita quantidades inteiras positivas", () => {
    const schema = pegarSchema(modulo, "estoqueSchema", arquivo);
    const dados = aceita<Record<string, number>>(schema, { caneta: 10, caderno: 3 }, "estoque valido");
    assert.deepEqual(dados, { caneta: 10, caderno: 3 });
  });

  it("estoqueSchema rejeita quantidades invalidas", () => {
    const schema = pegarSchema(modulo, "estoqueSchema", arquivo);
    rejeita(schema, { caneta: 0 }, "quantidade 0");
    rejeita(schema, { caneta: -1 }, "quantidade negativa");
    rejeita(schema, { caneta: 1.5 }, "quantidade decimal");
    rejeita(schema, { caneta: "10" }, "quantidade em texto");
  });

  it("tagsSchema exige de 1 a 5 itens", () => {
    const schema = pegarSchema(modulo, "tagsSchema", arquivo);
    aceita(schema, ["zod"], "uma tag");
    aceita(schema, ["a", "b", "c", "d", "e"], "cinco tags");
    rejeita(schema, [], "lista vazia");
    rejeita(schema, ["a", "b", "c", "d", "e", "f"], "seis tags");
    rejeita(schema, ["ok", 1], "tag numerica");
  });
});
