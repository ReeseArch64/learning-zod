import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { aceita, carregarExercicio, pegarSchema, pendente, rejeita } from "./_ajuda.ts";

const arquivo = "07-refinamentos.ts";
const modulo = await carregarExercicio(arquivo);

describe("Modulo 7: refinamentos e transformacoes", { skip: modulo ? false : pendente(arquivo) }, () => {
  it("aceita senhas iguais", () => {
    const schema = pegarSchema(modulo, "alteracaoSenhaSchema", arquivo);
    aceita(schema, { senha: "Senha1234", confirmacaoSenha: "Senha1234" }, "senhas iguais");
  });

  it("rejeita senhas diferentes apontando para confirmacaoSenha", () => {
    const schema = pegarSchema(modulo, "alteracaoSenhaSchema", arquivo);
    const erro = rejeita(schema, { senha: "Senha1234", confirmacaoSenha: "Outra1234" }, "senhas diferentes");
    const caminhos = erro.issues.map((problema) => problema.path.join("."));
    assert.ok(
      caminhos.includes("confirmacaoSenha"),
      `o erro deve usar path ["confirmacaoSenha"], recebido: ${JSON.stringify(caminhos)}`,
    );
  });

  it("rejeita senha curta", () => {
    const schema = pegarSchema(modulo, "alteracaoSenhaSchema", arquivo);
    rejeita(schema, { senha: "curta", confirmacaoSenha: "curta" }, "senha com menos de 8 caracteres");
  });

  it("normalizarEmailSchema apara espacos e usa minusculas", () => {
    const schema = pegarSchema(modulo, "normalizarEmailSchema", arquivo);
    const dados = aceita<string>(schema, "  ADA@Exemplo.COM  ", "email com espacos e maiusculas");
    assert.equal(dados, "ada@exemplo.com");
    rejeita(schema, "  nao-e-email  ", "texto que nao e email");
  });
});
