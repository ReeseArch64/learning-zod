import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { carregarExercicio, pegarExport, pegarSchema, pendente } from "./_ajuda.ts";

const arquivo = "10-metadados.ts";
const modulo = await carregarExercicio(arquivo);

describe("Modulo 10: metadados e JSON Schema", { skip: modulo ? false : pendente(arquivo) }, () => {
  it("registra titulo e descricao no schema", () => {
    const schema = pegarSchema(modulo, "usuarioComMetaSchema", arquivo);
    const meta = schema.meta();
    assert.ok(meta, "use .meta() para registrar os metadados do schema");
    assert.equal(typeof meta?.["title"], "string", "meta deve conter title");
    assert.equal(typeof meta?.["description"], "string", "meta deve conter description");
  });

  it("exporta o JSON Schema gerado", () => {
    const json = pegarExport<Record<string, unknown>>(modulo, "usuarioJsonSchema", arquivo);
    assert.equal(typeof json, "object", "usuarioJsonSchema deve ser um objeto");
    assert.ok(json !== null);
    const texto = JSON.stringify(json);
    assert.ok(texto.includes("email"), "o JSON Schema deve descrever o campo email");
    assert.ok(texto.includes("object"), "o JSON Schema deve descrever um objeto");
  });

  it("mantem a validacao funcionando com metadados", () => {
    const schema = pegarSchema(modulo, "usuarioComMetaSchema", arquivo);
    assert.equal(schema.safeParse({ nome: "Ada", email: "ada@exemplo.com" }).success, true);
    assert.equal(schema.safeParse({ nome: "Ada", email: "x" }).success, false);
  });
});
