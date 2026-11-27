# 📝 Blog — Sistema Web Completo

🎥 **Vídeo de apresentação:** [COLE AQUI O LINK DO VÍDEO](https://)

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

Projeto final de **Desenvolvimento Web (A2)**: um sistema de blog construído do banco à tela, com a mesma arquitetura da Clínica Médica das aulas. Dá para cadastrar autores e categorias, escrever posts e moderar os comentários dos leitores.

---

## 👥 Integrantes

| Nome completo | RGM | O que fez |
| :--- | :--- | :--- |
| Carlos Cavalcante | _RGM_ | _descreva aqui_ |
| _Nome completo_ | _RGM_ | _descreva aqui_ |
| _Nome completo_ | _RGM_ | _descreva aqui_ |
| _Nome completo_ | _RGM_ | _descreva aqui_ |

---

## 🧩 Tema e tabelas

**Tema:** Blog (tema próprio, não está na lista de sugestões).

| Tabela | Campos principais | Ligações |
| :--- | :--- | :--- |
| `autores` | nome, **email (único)**, bio | — |
| `categorias` | **nome (único)**, descricao | — |
| `posts` | titulo, conteudo, publicado | `autor_id` → `autores` e `categoria_id` → `categorias` |
| `comentarios` | leitor, texto | `post_id` → `posts` |
| `usuarios` | nome, **email (único)**, senha (hash bcrypt) | — (tabela só do login, não conta nas 4) |

```text
Autor 1 ──────< Post >────── 1 Categoria
                  │
                  1
                  │
                  ∧
              Comentario
```

- `posts` é a tabela ligada a **duas** outras (autor e categoria). A listagem já traz o nome do autor e da categoria (`include` no Prisma).
- `comentarios` traz o título do post a que pertence.
- Ao remover um autor, uma categoria ou um post, os registros ligados a ele também são removidos (`onDelete: Cascade`).

---

## 🏗️ Arquitetura

```text
projeto-api-blog/
├── package.json          # Raiz: npm workspaces (shared, api, frontend)
├── docker-compose.yml    # PostgreSQL
├── shared/               # Schemas Zod e tipos usados pela API e pelo frontend
│   └── src/
├── api/                  # Backend (Express + Prisma)
│   ├── .env.example
│   ├── prisma/           # schema.prisma, migrations e seed.ts
│   └── src/
│       ├── config/       # Prisma Client e Swagger
│       ├── routes/       # Rotas Express
│       ├── controllers/  # Requisição e resposta HTTP
│       ├── services/     # Regras de negócio
│       ├── repositories/ # Acesso ao banco (Prisma)
│       ├── middlewares/  # validarBody (Zod) e tratamento de erros
│       └── server.ts
└── frontend/             # React + Vite + Mantine + Axios
    └── src/
        ├── pages/        # Login, Cadastro, Home e uma tela por tabela
        ├── components/   # Menu lateral e modais
        └── services/api.ts   # Todas as chamadas Axios
```

A API é organizada em camadas: **routes → controllers → services → repositories**.

---

## 🚀 Como rodar, do zero

### Pré-requisitos
- [Node.js](https://nodejs.org/) 20 ou superior
- [Docker](https://www.docker.com/) com Docker Compose (ou um PostgreSQL instalado na máquina)

### 1. Clonar e instalar (na raiz, instala os três pacotes)
```bash
git clone https://github.com/CarlosCavalcante17/projeto-api-blog.git
cd projeto-api-blog
npm install
```

### 2. Subir o banco de dados
```bash
docker compose up -d
```
Sobe um PostgreSQL 16 na porta `5432` (usuário `postgres`, senha `postgres`, banco `blog`).

> Sem Docker? Instale o PostgreSQL, crie um banco chamado `blog` e ajuste a `DATABASE_URL` no passo seguinte.

### 3. Criar o `.env` da API
```bash
cp api/.env.example api/.env
```
(No Windows, sem `cp`: copie o arquivo `api/.env.example` e renomeie a cópia para `api/.env`.)

### 4. Rodar as migrations e o seed
```bash
cd api
npx prisma migrate dev
npx prisma db seed
cd ..
```
O seed preenche todas as tabelas com dados de exemplo e pode ser rodado de novo sem duplicar nada.

### 5. Subir a API
```bash
npm run dev -w api
```
API em `http://localhost:3000` e documentação Swagger em **`http://localhost:3000/docs`**.

### 6. Subir o frontend (em outro terminal)
```bash
npm run dev -w frontend
```
Frontend em `http://localhost:5173`.

### Builds
```bash
npm run build -w api
npm run build -w frontend
```

---

## 🔑 Usuário do seed para entrar no sistema

| Campo | Valor |
| :--- | :--- |
| E-mail | `professor@blog.com` |
| Senha | `Professor@123` |

Também é possível criar uma conta nova na tela **Cadastre-se**.

---

## 📡 Rotas da API

Todas as tabelas do sistema têm CRUD completo:

| Método | Rota | Descrição | Sucesso |
| :--- | :--- | :--- | :--- |
| `GET` | `/{recurso}` | Lista todos | `200` |
| `GET` | `/{recurso}/:id` | Busca por id | `200` / `404` |
| `POST` | `/{recurso}` | Cria | `201` / `400` / `409` |
| `PUT` | `/{recurso}/:id` | Edita | `200` / `400` / `404` / `409` |
| `DELETE` | `/{recurso}/:id` | Remove | `204` / `404` |

Onde `{recurso}` é `autores`, `categorias`, `posts` ou `comentarios`.

**Autenticação**

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `POST` | `/usuarios` | Cadastra um usuário (senha guardada com bcrypt, nunca devolvida) |
| `POST` | `/auth/login` | Recebe `email` e `senha` e devolve o usuário (sem a senha). `401` se não conferem |

**Erros**
- `400`: dado inválido, com a mensagem de cada campo em `detalhes`.
- `404`: o id não existe.
- `409`: valor repetido em campo único (e-mail do autor, nome da categoria, e-mail do usuário).

---

## 🛠️ Tecnologias

Node.js · Express 5 · TypeScript · Prisma 7 · PostgreSQL 16 · Zod (schemas no pacote `shared`) · bcryptjs · Swagger (zod-to-openapi) · React 19 · Vite · Mantine · Axios · Docker