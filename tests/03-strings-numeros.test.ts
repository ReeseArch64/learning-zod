import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { aceita, campos, carregarExercicio, pegarSchema, pendente, rejeita } from "./_ajuda.ts";

const arquivo = "03-strings-numeros.ts";
const modulo = await carregarExercicio(arquivo);

const valido = { email: "ada@exemplo.com", senha: "Senha1234", idade: 30 };

describe("Modulo 3: strings e numeros", { skip: modulo ? false : pendente(arquivo) }, () => {
  it("aceita um cadastro valido", () => {
    const schema = pegarSchema(modulo, "cadastroSchema", arquivo);
    const dados = aceita<typeof valido>(schema, valido, "cadastro valido");
    assert.equal(dados.email, valido.email);
  });

  it("rejeita e-mail invalido", () => {
    const schema = pegarSchema(modulo, "cadastroSchema", arquivo);
    const erro = rejeita(schema, { ...valido, email: "ada(arroba)exemplo" }, "email invalido");
    assert.ok(campos(erro).email, "o erro deve apontar para o campo email");
  });

  it("rejeita senha fraca", () => {
    const schema = pegarSchema(modulo, "cadastroSchema", arquivo);
    rejeita(schema, { ...valido, senha: "curta1A" }, "senha com menos de 8 caracteres");
    rejeita(schema, { ...valido, senha: "somenteminuscula" }, "senha sem maiuscula e sem digito");
    rejeita(schema, { ...valido, senha: "SEMDIGITOAQUI" }, "senha sem digito e sem minuscula");
  });

  it("rejeita idade menor que 18 ou nao inteira", () => {
    const schema = pegarSchema(modulo, "cadastroSchema", arquivo);
    rejeita(schema, { ...valido, idade: 17 }, "idade 17");
    rejeita(schema, { ...valido, idade: 20.5 }, "idade decimal");
  });
});
