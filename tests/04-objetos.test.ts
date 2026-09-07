import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { aceita, carregarExercicio, pegarSchema, pendente, rejeita } from "./_ajuda.ts";

const arquivo = "04-objetos.ts";
const modulo = await carregarExercicio(arquivo);

const usuario = { nome: "Ada", email: "ada@exemplo.com", idade: 36 };

describe("Modulo 4: objetos", { skip: modulo ? false : pendente(arquivo) }, () => {
  it("criarUsuarioSchema remove chaves desconhecidas", () => {
    const schema = pegarSchema(modulo, "criarUsuarioSchema", arquivo);
    const dados = aceita<Record<string, unknown>>(schema, { ...usuario, admin: true }, "usuario com chave extra");
    assert.deepEqual(dados, usuario, "a chave extra deve ser removida");
  });

  it("usuarioEstritoSchema rejeita chaves desconhecidas", () => {
    const schema = pegarSchema(modulo, "usuarioEstritoSchema", arquivo);
    aceita(schema, usuario, "usuario sem chave extra");
    rejeita(schema, { ...usuario, admin: true }, "usuario com chave extra");
  });

  it("atualizarUsuarioSchema torna todos os campos opcionais", () => {
    const schema = pegarSchema(modulo, "atualizarUsuarioSchema", arquivo);
    assert.deepEqual(aceita(schema, {}, "atualizacao vazia"), {});
    aceita(schema, { nome: "Grace" }, "atualizacao parcial");
  });

  it("atualizarUsuarioSchema mantem as validacoes de cada campo", () => {
    const schema = pegarSchema(modulo, "atualizarUsuarioSchema", arquivo);
    rejeita(schema, { email: "invalido" }, "email invalido na atualizacao");
    rejeita(schema, { idade: -1 }, "idade negativa na atualizacao");
  });

  it("os campos obrigatorios continuam obrigatorios na criacao", () => {
    const schema = pegarSchema(modulo, "criarUsuarioSchema", arquivo);
    rejeita(schema, { nome: "Ada" }, "criacao sem email e idade");
  });
});
