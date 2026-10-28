# 🧺 Agente de produtos com LangChain

> API de conversa em que um agente de IA **consulta o catálogo de produtos de um supermercado no MySQL** usando ferramentas (*tools*) do LangChain.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-1C3C3C?style=flat-square&logo=langchain&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-F55036?style=flat-square)

## O que ele faz

Você pergunta em linguagem natural e o agente decide se precisa olhar o banco:

| Ferramenta | Para quê |
|---|---|
| `ToolVerTodosOsProdutos` | listar todos os produtos disponíveis |
| `ToolProdutosPorNome` | buscar um produto pelo nome (consulta parametrizada) |

Modelo: `openai/gpt-oss-120b` via **Groq**. O `schema.sql` cria lotes, categorias, produtos, fornecedores, clientes e os relacionamentos.

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/conversa` | envia `{ "pergunta": "..." }` e recebe a resposta do agente |
| `GET` | `/conversa/historico` | devolve o histórico da execução atual |

## Como rodar

```bash
git clone https://github.com/joseaugustodearaujoaraujo1-lgtm/agent_langchain_produtos.git
cd agent_langchain_produtos
npm install
```

1. Execute `schema.sql` no MySQL (cria o banco `supermercado`).
2. `cp .env.example .env` e preencha `PORTA_SERVIDOR`, `API_GROQ` e `DB_*`.
3. Rode `node langchain.js`.

```bash
curl -X POST http://localhost:3001/conversa -H "Content-Type: application/json" \
  -d '{"pergunta":"Quais produtos existem?"}'
```

(Use a porta definida em `PORTA_SERVIDOR`.)

## Boas práticas já aplicadas

- Consultas SQL com **parâmetros** (`?`), sem concatenar texto do usuário.
- Entrada das ferramentas validada com **Zod**.
- `cors` e `morgan` configurados.

## Limitações conhecidas

- O histórico fica em memória.
- Só há duas ferramentas, ambas de leitura; nada altera o banco.
- `express-rate-limit` está instalado, mas ainda não configurado nas rotas.
