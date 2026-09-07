import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { aceita, carregarExercicio, pegarSchema, pendente, rejeita } from "./_ajuda.ts";

const arquivo = "06-unioes.ts";
const modulo = await carregarExercicio(arquivo);

describe("Modulo 6: unioes discriminadas", { skip: modulo ? false : pendente(arquivo) }, () => {
  it("aceita o evento de click", () => {
    const schema = pegarSchema(modulo, "eventoSchema", arquivo);
    const dados = aceita<Record<string, unknown>>(schema, { tipo: "click", x: 10, y: 20 }, "evento click");
    assert.deepEqual(dados, { tipo: "click", x: 10, y: 20 });
  });

  it("aceita o evento de scroll", () => {
    const schema = pegarSchema(modulo, "eventoSchema", arquivo);
    const dados = aceita<Record<string, unknown>>(schema, { tipo: "scroll", deltaY: -120 }, "evento scroll");
    assert.deepEqual(dados, { tipo: "scroll", deltaY: -120 });
  });

  it("rejeita tipo desconhecido", () => {
    const schema = pegarSchema(modulo, "eventoSchema", arquivo);
    rejeita(schema, { tipo: "hover", x: 1, y: 2 }, "tipo hover");
    rejeita(schema, { x: 1, y: 2 }, "evento sem discriminante");
  });

  it("rejeita payload incompativel com o tipo", () => {
    const schema = pegarSchema(modulo, "eventoSchema", arquivo);
    rejeita(schema, { tipo: "click", x: 10 }, "click sem y");
    rejeita(schema, { tipo: "scroll", x: 10, y: 20 }, "scroll sem deltaY");
  });
});
