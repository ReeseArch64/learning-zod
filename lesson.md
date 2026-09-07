# Plano de estudo: Zod

Repositório de estudo focado exclusivamente em **Zod v4** (`zod@4.5.4`), com TypeScript, `tsx` para execução e `tsup` para build.

## Objetivo

Ao final, você deve ser capaz de:

- Modelar qualquer formato de dado com schemas Zod.
- Inferir tipos TypeScript a partir dos schemas, sem duplicar definições.
- Tratar erros de validação de forma legível para API e para formulário.
- Transformar, refinar e compor schemas com segurança de tipos.
- Integrar Zod em fronteiras de entrada: HTTP, variáveis de ambiente, arquivos e formulários.

## Pré-requisitos

- TypeScript básico: tipos, generics, `type` vs `interface`, união e interseção.
- Node.js instalado. Use `npm run dev` para rodar `src/index.ts` em watch.

## Como estudar

Cada módulo tem um exercício em `src/` e um teste correspondente em `tests/`. O teste é a validação: falha em vermelho enquanto o exercício não atende ao proposto e passa em verde quando atende.

1. Leia o módulo e o contrato do exercício nas regras abaixo.
2. Crie o arquivo exato indicado, por exemplo `src/01-fundamentos.ts`.
3. Rode `npm run test:watch` e trabalhe até o módulo ficar verde.
4. Rode `npm run check` para validar a inferência de tipos.
5. Registre dúvidas e conclusões na seção "Notas" deste arquivo.

## Comandos

| Comando | Uso |
| --- | --- |
| `npm test` | Roda todos os testes dos exercícios |
| `npm run test:watch` | Roda os testes em modo watch |
| `npm run dev` | Executa `src/index.ts` em modo watch com `tsx` |
| `npm start` | Executa `src/index.ts` uma vez |
| `npm run check` | Checagem de tipos sem emitir arquivos |
| `npm run build` | Gera o bundle ESM e as declarações em `dist/` |

## Regras dos exercícios

Estas regras são obrigatórias. Os testes dependem delas.

1. **Nome do arquivo**: use exatamente o caminho indicado em cada módulo. O teste procura o arquivo por esse nome.
2. **Nome dos exports**: use exatamente o nome de export pedido. Nome diferente falha com a mensagem `deve exportar "x"`.
3. **Um arquivo por módulo**: não junte exercícios de módulos diferentes no mesmo arquivo.
4. **Sem editar `tests/`**: os testes definem o critério de aprovação. Ajuste o seu código, não o teste.
5. **Só Zod e TypeScript**: nenhuma dependência nova é necessária.
6. **Exercício não criado** aparece como suíte pulada (`﹣`) com a mensagem `Exercicio pendente: crie src/NN-nome.ts`. Isso não é aprovação.
7. **Módulo concluído** aparece com `✔` em todos os testes da suíte.
8. **Falha** mostra o motivo, o contexto e o erro Zod formatado por `z.prettifyError`.
9. Schemas exportados devem ser instâncias de `z.ZodType`. Funções exportadas devem ser funções.
10. Rode `npm run check` além de `npm test`: o teste valida o runtime, o `tsc` valida os tipos.

### Mapa de arquivos e exports

| Módulo | Arquivo | Exports obrigatórios |
| --- | --- | --- |
| 1 | `src/01-fundamentos.ts` | `configSchema` |
| 2 | `src/02-primitivos.ts` | `querySchema` |
| 3 | `src/03-strings-numeros.ts` | `cadastroSchema` |
| 4 | `src/04-objetos.ts` | `criarUsuarioSchema`, `usuarioEstritoSchema`, `atualizarUsuarioSchema` |
| 5 | `src/05-colecoes.ts` | `estoqueSchema`, `tagsSchema` |
| 6 | `src/06-unioes.ts` | `eventoSchema` |
| 7 | `src/07-refinamentos.ts` | `alteracaoSenhaSchema`, `normalizarEmailSchema` |
| 8 | `src/08-erros.ts` | `validarUsuario` |
| 9 | `src/09-avancados.ts` | `noSchema`, `idSchema` |
| 10 | `src/10-metadados.ts` | `usuarioComMetaSchema`, `usuarioJsonSchema` |
| 11 | `src/11-organizacao.ts` | `usuarioSchema`, `validarLote` |
| 12 | `src/12-aplicacao.ts` | `envSchema`, `carregarEnv` |

---

## Módulo 1: fundamentos

- Instalar e importar: `import { z } from "zod"`.
- Criar o primeiro schema e validar com `parse`.
- Diferença entre `parse` (lança `ZodError`) e `safeParse` (retorna `{ success, data | error }`).
- Versões assíncronas: `parseAsync` e `safeParseAsync`.
- Inferência de tipos: `z.infer`, `z.input` e `z.output`.

**Exercício** em `src/01-fundamentos.ts`, teste em `tests/01-fundamentos.test.ts`.

Exporte `configSchema`, um objeto com:

- `host`: string com no mínimo 1 caractere.
- `porta`: número inteiro entre 1 e 65535.
- `debug`: booleano com valor padrão `false`.

Exporte também o tipo `Config` com `z.infer`.

## Módulo 2: tipos primitivos

- `z.string()`, `z.number()`, `z.boolean()`, `z.bigint()`, `z.date()`, `z.symbol()`.
- Vazios e especiais: `z.undefined()`, `z.null()`, `z.void()`, `z.any()`, `z.unknown()`, `z.never()`.
- `z.literal()` e `z.nan()`.
- Coerção com `z.coerce.number()`, `z.coerce.date()`, `z.coerce.boolean()`.
- `z.stringbool()` para converter `"true"` e `"false"` em booleano.

**Exercício** em `src/02-primitivos.ts`, teste em `tests/02-primitivos.test.ts`.

Exporte `querySchema`, que recebe tudo como texto e devolve valores tipados:

- `pagina`: inteiro coagido, mínimo 1, padrão `1`.
- `limite`: inteiro coagido, entre 1 e 100, padrão `20`.
- `ativo`: booleano a partir de texto, padrão `false`.
- `desde`: data coagida, opcional.

## Módulo 3: validações de string e número

- String: `min`, `max`, `length`, `regex`, `startsWith`, `endsWith`, `includes`, `trim`, `toLowerCase`, `toUpperCase`.
- Formatos como schemas próprios: `z.email()`, `z.url()`, `z.httpUrl()`, `z.uuid()`, `z.uuidv4()`, `z.guid()`, `z.cuid2()`, `z.nanoid()`, `z.ulid()`, `z.jwt()`, `z.ipv4()`, `z.ipv6()`, `z.cidrv4()`, `z.base64()`, `z.hex()`, `z.emoji()`, `z.creditCard()`.
- Datas em texto: `z.iso.date()`, `z.iso.time()`, `z.iso.datetime()`, `z.iso.duration()`.
- Número: `int`, `positive`, `nonnegative`, `negative`, `nonpositive`, `multipleOf`, `gt`, `gte`, `lt`, `lte`, `z.int32()`, `z.float64()`.

Atenção: na v4 os formatos de string passaram a ser funções de topo (`z.email()`). Os métodos encadeados (`z.string().email()`) ainda existem, mas estão depreciados.

**Exercício** em `src/03-strings-numeros.ts`, teste em `tests/03-strings-numeros.test.ts`.

Exporte `cadastroSchema` com:

- `email`: e-mail válido.
- `senha`: mínimo 8 caracteres, com ao menos uma maiúscula, uma minúscula e um dígito.
- `idade`: inteiro maior ou igual a 18.

## Módulo 4: objetos

- `z.object()`, acesso a `.shape`, `.keyof()`.
- Modos de chave desconhecida: `z.object()` remove, `z.strictObject()` rejeita, `z.looseObject()` mantém.
- Composição: `.extend()`, `.pick()`, `.omit()`, `.partial()`, `.required()`, `.merge` via `extend`.
- Campos opcionais: `.optional()`, `.nullable()`, `.nullish()`, `z.exactOptional()`.
- Valores padrão: `.default()` e `.prefault()`.

**Exercício** em `src/04-objetos.ts`, teste em `tests/04-objetos.test.ts`.

- `criarUsuarioSchema`: `nome` não vazio, `email` válido, `idade` inteira não negativa. Remove chaves desconhecidas.
- `usuarioEstritoSchema`: mesmos campos, porém rejeita chaves desconhecidas.
- `atualizarUsuarioSchema`: derivado de `criarUsuarioSchema`, com todos os campos opcionais e as mesmas validações.

## Módulo 5: coleções

- `z.array()` com `min`, `max`, `length`, `nonempty`.
- `z.tuple()` com elemento rest.
- `z.record()`, `z.partialRecord()`, `z.looseRecord()`.
- `z.map()` e `z.set()`.

**Exercício** em `src/05-colecoes.ts`, teste em `tests/05-colecoes.test.ts`.

- `estoqueSchema`: registro de chave string para inteiro positivo.
- `tagsSchema`: lista de strings com no mínimo 1 e no máximo 5 itens.

## Módulo 6: uniões e combinações

- `z.union()` e o formato do erro `invalid_union`.
- `z.discriminatedUnion()` para variantes com campo discriminante.
- `z.intersection()` e seus limites.
- `z.xor()` para exclusividade.
- `z.enum()` e `z.nativeEnum()` para enums do TypeScript.
- `z.literal()` com múltiplos valores.

**Exercício** em `src/06-unioes.ts`, teste em `tests/06-unioes.test.ts`.

Exporte `eventoSchema`, uma união discriminada pelo campo `tipo`:

- `{ tipo: "click", x: number, y: number }`
- `{ tipo: "scroll", deltaY: number }`

## Módulo 7: refinamentos e transformações

- `.refine()` com mensagem e `path` customizados.
- `.superRefine()` e `ctx.addIssue` para múltiplos erros.
- `.check()` como API de baixo nível na v4.
- `.transform()` e o efeito na diferença entre `z.input` e `z.output`.
- `.pipe()` para encadear validação e transformação.
- `z.preprocess()` para normalizar antes de validar.
- `.overwrite()` para transformar sem mudar o tipo de saída.
- `.catch()` para valor de fallback quando a validação falha.

**Exercício** em `src/07-refinamentos.ts`, teste em `tests/07-refinamentos.test.ts`.

- `alteracaoSenhaSchema`: `senha` com no mínimo 8 caracteres e `confirmacaoSenha`. Se forem diferentes, o erro deve usar `path: ["confirmacaoSenha"]`.
- `normalizarEmailSchema`: recebe texto, remove espaços nas pontas, converte para minúsculas e só então valida como e-mail.

## Módulo 8: erros

- Anatomia do `ZodError` e do array `issues`.
- Códigos em `z.ZodIssueCode`.
- Formatadores: `z.treeifyError()`, `z.flattenError()`, `z.prettifyError()`.
- Mensagens customizadas por schema e via `error` como função.
- Mapa de erros global: `z.config()`, `z.setErrorMap()`.
- Internacionalização com `z.locales`.

**Exercício** em `src/08-erros.ts`, teste em `tests/08-erros.test.ts`.

Exporte a função `validarUsuario(entrada: unknown)` para um usuário com `nome` não vazio e `email` válido. Ela nunca lança exceção e retorna:

- sucesso: `{ ok: true, dados }`
- falha: `{ ok: false, status: 422, erros }`, onde `erros` é `Record<string, string[]>` com apenas os campos que falharam.

## Módulo 9: tipos avançados

- `z.lazy()` para schemas recursivos, como árvore de comentários.
- `z.templateLiteral()`.
- `z.custom()` e `z.instanceof()`.
- `z.function()` para validar entrada e saída de funções.
- `z.promise()`, `z.file()`, `z.json()`.
- `.readonly()`, `.brand()` para tipos nominais.

**Exercício** em `src/09-avancados.ts`, teste em `tests/09-avancados.test.ts`.

- `noSchema`: nó recursivo `{ nome: string, filhos: No[] }`, com `filhos` padrão `[]`. Use getter ou `z.lazy()`.
- `idSchema`: UUID com marca de tipo via `.brand()`.

## Módulo 10: metadados e interoperabilidade

- `.describe()` e `.meta()`.
- Registries: `z.registry()` e `z.globalRegistry`.
- `z.toJSONSchema()` para gerar JSON Schema.
- `z.fromJSONSchema()` para o caminho inverso.
- Codecs: `z.codec()`, `z.encode()`, `z.decode()`, `z.invertCodec()`.

**Exercício** em `src/10-metadados.ts`, teste em `tests/10-metadados.test.ts`.

- `usuarioComMetaSchema`: objeto com `nome` não vazio e `email` válido, anotado com `.meta()` contendo `title` e `description`.
- `usuarioJsonSchema`: resultado de `z.toJSONSchema(usuarioComMetaSchema)`.

## Módulo 11: performance e organização

- `z.compile()` para schemas usados em caminho crítico.
- `zod/mini` e o impacto no tamanho do bundle.
- Onde validar: apenas nas fronteiras do sistema, não em toda função interna.
- Estratégia de reuso: um módulo de schemas exportando tipos inferidos.

**Exercício** em `src/11-organizacao.ts`, teste em `tests/11-organizacao.test.ts`.

- `usuarioSchema`: `nome` não vazio e `email` válido.
- `validarLote(itens: unknown[])`: retorna `{ validos, invalidos }`, onde cada inválido é `{ indice, erros: string[] }` com o índice original do item.

## Módulo 12: aplicação prática

**Exercício** em `src/12-aplicacao.ts`, teste em `tests/12-aplicacao.test.ts`.

- `envSchema`:
  - `NODE_ENV`: enum `development`, `test` ou `production`, padrão `development`.
  - `PORT`: inteiro coagido entre 1 e 65535, padrão `3000`.
  - `DATABASE_URL`: URL válida e obrigatória.
- `carregarEnv(bruto: unknown)`: retorna o ambiente validado ou lança um `Error` cuja mensagem cita o nome da variável com problema. Use `z.prettifyError`.

Depois de aprovar o módulo, escolha um cenário extra para praticar por conta própria:

1. Validação de corpo, query e params de uma rota HTTP.
2. Validação de resposta de uma API externa antes de usar os dados.
3. Parser de arquivo JSON ou CSV com relatório de erros por linha.
4. Schema compartilhado entre formulário e backend.

---

## Armadilhas comuns na v4

- Formatos de string viraram funções de topo: prefira `z.email()` a `z.string().email()`, que está depreciado.
- `.default()` aplica o padrão na saída; `.prefault()` aplica antes da validação.
- `z.object()` remove chaves desconhecidas por padrão. Use `z.strictObject()` para rejeitar.
- `.transform()` faz `z.input` e `z.output` divergirem. Escolha o correto ao tipar funções.
- `parse` lança exceção. Em fronteiras de entrada, prefira `safeParse`.
- `z.coerce` nunca falha antes de converter, então `z.coerce.number()` aceita `""` como `0`.

## Referências

- Documentação oficial: https://zod.dev
- Repositório: https://github.com/colinhacks/zod
- Guia de migração v3 para v4: https://zod.dev/v4/changelog

## Notas

<!-- Registre aqui dúvidas, descobertas e conclusões por módulo. -->
