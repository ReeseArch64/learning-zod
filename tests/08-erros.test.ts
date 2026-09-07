import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { carregarExercicio, pegarFuncao, pendente } from "./_ajuda.ts";

const arquivo = "08-erros.ts";
const modulo = await carregarExercicio(arquivo);

type Resultado =
  | { ok: true; dados: { nome: string; email: string } }
  | { ok: false; status: number; erros: Record<string, string[]> };

describe("Modulo 8: tratamento de erros", { skip: modulo ? false : pendente(arquivo) }, () => {
  it("retorna ok com os dados validados", () => {
    const validar = pegarFuncao<(entrada: unknown) => Resultado>(modulo, "validarUsuario", arquivo);
    const resultado = validar({ nome: "Ada", email: "ada@exemplo.com" });
    assert.equal(resultado.ok, true, "entrada valida deve retornar ok true");
    assert.deepEqual(resultado.ok ? resultado.dados : null, { nome: "Ada", email: "ada@exemplo.com" });
  });

  it("retorna status 422 e erros por campo", () => {
    const validar = pegarFuncao<(entrada: unknown) => Resultado>(modulo, "validarUsuario", arquivo);
    const resultado = validar({ nome: "", email: "invalido" });
    assert.equal(resultado.ok, false, "entrada invalida deve retornar ok false");
    if (resultado.ok) return;
    assert.equal(resultado.status, 422);
    assert.ok(Array.isArray(resultado.erros["nome"]), "erros.nome deve ser uma lista de mensagens");
    assert.ok(Array.isArray(resultado.erros["email"]), "erros.email deve ser uma lista de mensagens");
    assert.ok((resultado.erros["email"] ?? []).length > 0, "erros.email nao pode estar vazio");
  });

  it("nao inclui campos que passaram na validacao", () => {
    const validar = pegarFuncao<(entrada: unknown) => Resultado>(modulo, "validarUsuario", arquivo);
    const resultado = validar({ nome: "Ada", email: "invalido" });
    assert.equal(resultado.ok, false);
    if (resultado.ok) return;
    assert.equal(resultado.erros["nome"], undefined, "campos validos nao devem aparecer em erros");
  });

  it("nao lanca excecao para entrada de tipo errado", () => {
    const validar = pegarFuncao<(entrada: unknown) => Resultado>(modulo, "validarUsuario", arquivo);
    const resultado = validar(null);
    assert.equal(resultado.ok, false, "use safeParse para nao lancar excecao");
  });
});
