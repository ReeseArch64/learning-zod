import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { carregarExercicio, pegarFuncao, pegarSchema, pendente } from "./_ajuda.ts";

const arquivo = "11-organizacao.ts";
const modulo = await carregarExercicio(arquivo);

type Lote = {
  validos: { nome: string; email: string }[];
  invalidos: { indice: number; erros: string[] }[];
};

describe("Modulo 11: organizacao e lotes", { skip: modulo ? false : pendente(arquivo) }, () => {
  it("exporta o schema de usuario reutilizavel", () => {
    const schema = pegarSchema(modulo, "usuarioSchema", arquivo);
    assert.equal(schema.safeParse({ nome: "Ada", email: "ada@exemplo.com" }).success, true);
  });

  it("separa itens validos de invalidos", () => {
    const validarLote = pegarFuncao<(itens: unknown[]) => Lote>(modulo, "validarLote", arquivo);
    const resultado = validarLote([
      { nome: "Ada", email: "ada@exemplo.com" },
      { nome: "", email: "invalido" },
      "nao e objeto",
      { nome: "Grace", email: "grace@exemplo.com" },
    ]);
    assert.equal(resultado.validos.length, 2, "deve haver 2 itens validos");
    assert.equal(resultado.invalidos.length, 2, "deve haver 2 itens invalidos");
  });

  it("informa o indice original de cada item invalido", () => {
    const validarLote = pegarFuncao<(itens: unknown[]) => Lote>(modulo, "validarLote", arquivo);
    const resultado = validarLote([{ nome: "Ada", email: "ada@exemplo.com" }, { nome: "", email: "invalido" }]);
    assert.deepEqual(
      resultado.invalidos.map((item) => item.indice),
      [1],
    );
    assert.ok((resultado.invalidos[0]?.erros.length ?? 0) > 0, "cada invalido deve trazer ao menos uma mensagem");
  });

  it("retorna listas vazias para entrada vazia", () => {
    const validarLote = pegarFuncao<(itens: unknown[]) => Lote>(modulo, "validarLote", arquivo);
    assert.deepEqual(validarLote([]), { validos: [], invalidos: [] });
  });
});
