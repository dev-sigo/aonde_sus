# 📘 Guia de Escrita de Testes  
**Projeto: Aonde SUS**

Este guia define o padrão de escrita e organização dos testes automatizados do projeto **Aonde SUS**.

O objetivo não é apenas validar código, mas **explicar o comportamento do sistema de forma clara, humana e acessível**, servindo também como documentação viva.

## 🎯 Objetivo dos testes

Os testes existem para:

- Explicar como o sistema se comporta em diferentes situações
- Proteger regras de negócio contra regressões
- Servir como documentação compreensível, inclusive para pessoas não técnicas

Um bom teste deve poder ser lido quase como um texto em português.

## 1️⃣ Princípios fundamentais

### 1. Testes descrevem comportamento, não implementação

Testes **não devem** validar detalhes internos do código.  
Eles devem validar **o que acontece**, não *como acontece*.

🟢 _“deve retornar uma lista vazia quando nenhuma unidade é informada”_  
🔴 _“deve chamar a função X internamente”_

---

### 2. Linguagem humana vem antes da técnica

Sempre que possível, use termos compreensíveis por qualquer pessoa, mesmo sem conhecimento técnico.

🟢 _“Quando o usuário quer ver apenas unidades abertas no momento_  
🔴 _“Filtro por isOpenNow”_

---

### 3. Cada teste responde a uma única pergunta

Um teste deve validar **um único comportamento observável**.

Se o teste precisa de muitas explicações para ser entendido, ele provavelmente está testando mais de uma coisa.

---

### 4. O `describe` cria o contexto, o `test` afirma a regra

- `describe` → **Em que situação estamos**
- `test` → **O que deve acontecer nessa situação**

Leia sempre como uma frase contínua.

**Exemplo:**

> Quando o tipo da unidade é informado  
> → deve retornar apenas unidades do tipo informado


## 2️⃣ Regras práticas de escrita

### 🧱 Estrutura recomendada

```js
describe('Como as unidades de saúde são filtradas', () => {
  describe('Quando o tipo da unidade é informado', () => {
    test('deve retornar apenas unidades do tipo informado', () => {
      // ...
    });
  });
});
```

---

### 📝 Padrões de escrita

#### `describe`

* Começa com **“Quando”**
* Define o contexto ou intenção do usuário
* Evita termos técnicos

🟢 _"Quando especialidades médicas são informadas"_  
🔴 _"Filtro por especialidades"_

---

#### `test`

* Sempre começa com **“deve”**
* Afirma um resultado claro e observável
* Evita termos como *array*, *boolean*, *flag*, etc.

🟢 _"deve retornar uma lista vazia quando nenhuma unidade é informada"_  
🔴 _"deve retornar array vazio"_

## 3️⃣ Asserções: como validar corretamente

### Priorize comportamento, não detalhes frágeis

Evite testes que dependem de:

* quantidade exata de itens, quando isso não é essencial
* posições fixas na lista
* identificadores específicos

✔️ **Bom exemplo**

```js
expect(result.every((unit) => unit.schedule !== undefined)).toBe(true);
```

❌ **Frágil**

```js
expect(result.length).toBe(2);
expect(result[0].id).toBe(1);
```

---

### Quando usar `toEqual`

Use comparações diretas apenas quando:

* os dados são conhecidos
* a ordem faz parte da regra de negócio
* a lista é pequena e controlada

## 4️⃣ Testes que dependem de data e horário

* O horário atual deve ser **explicitamente simulado**
* O teste deve representar uma **regra de negócio**, não um cenário arbitrário

✔️

```js
test('deve considerar aberta uma unidade apenas se o horário atual estiver dentro do seu período de funcionamento', () => {
  //
});
```

O comportamento deve ser compreensível apenas lendo o nome do teste.

## 5️⃣ Modelo mental para escrever um teste

Antes de escrever o código, responda mentalmente:

1. **Em que situação estamos?**
   → `describe`

2. **O que o sistema deve fazer nessa situação?**
   → `test`

3. **Como provar isso sem depender da implementação?**
   → `expect`

Se você não consegue responder essas três perguntas em português simples, o teste ainda não está pronto.

## 6️⃣ Checklist antes de commitar

Use esta lista rápida para validar seus testes:

* [ ] Dá para entender o teste sem conhecer o código?
* [ ] O `describe` cria um contexto claro?
* [ ] O `test` afirma apenas um comportamento?
* [ ] As asserções são robustas e não frágeis?
* [ ] O teste falharia se a regra de negócio fosse quebrada?

## 📌 Observação final

Testes não são apenas uma ferramenta técnica.
Eles contam a história do sistema e protegem suas decisões de negócio ao longo do tempo.

No Aonde SUS, **testar é explicar**.
