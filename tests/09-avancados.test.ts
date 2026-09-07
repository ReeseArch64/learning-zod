import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { aceita, carregarExercicio, pegarSchema, pendente, rejeita } from "./_ajuda.ts";

const arquivo = "09-avancados.ts";
const modulo = await carregarExercicio(arquivo);

type No = { nome: string; filhos: No[] };

describe("Modulo 9: tipos avancados", { skip: modulo ? false : pendente(arquivo) }, () => {
  it("aceita uma arvore com tres niveis", () => {
    const schema = pegarSchema(modulo, "noSchema", arquivo);
    const dados = aceita<No>(
      schema,
      { nome: "raiz", filhos: [{ nome: "src", filhos: [{ nome: "index.ts", filhos: [] }] }] },
      "arvore aninhada",
    );
    assert.equal(dados.filhos[0]?.filhos[0]?.nome, "index.ts");
  });

  it("usa lista vazia como padrao de filhos", () => {
    const schema = pegarSchema(modulo, "noSchema", arquivo);
    const dados = aceita<No>(schema, { nome: "folha" }, "no sem filhos");
    assert.deepEqual(dados.filhos, [], "filhos deve ter default []");
  });

  it("valida os nos aninhados", () => {
    const schema = pegarSchema(modulo, "noSchema", arquivo);
    rejeita(schema, { nome: "raiz", filhos: [{ nome: 42 }] }, "filho com nome numerico");
    rejeita(schema, { nome: "raiz", filhos: "src" }, "filhos que nao e lista");
  });

  it("idSchema cria um tipo com marca", () => {
    const schema = pegarSchema(modulo, "idSchema", arquivo);
    aceita(schema, "018f4b1f-3a2f-7a3b-9c1d-2f4a6b8c0d1e", "uuid valido");
    rejeita(schema, "123", "uuid invalido");
  });
});
