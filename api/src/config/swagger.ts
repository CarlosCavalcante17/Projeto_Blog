import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  extendZodWithOpenApi,
} from "@asteasolutions/zod-to-openapi";
import { z, type ZodType } from "zod";
import { autorSchema } from "@blog/shared/autor";
import { categoriaSchema } from "@blog/shared/categoria";
import { postSchema } from "@blog/shared/post";
import { comentarioSchema } from "@blog/shared/comentario";
import { cadastroUsuarioSchema, usuarioSchema } from "@blog/shared/usuario";
import { loginSchema } from "@blog/shared/auth";

extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

// -------------------------------------------------------------
// 1. Helpers reutilizáveis (eliminam o boilerplate do OpenAPI)
// -------------------------------------------------------------
const idParam = z.object({
  id: z.coerce.number().openapi({ example: 1, description: "ID numérico" }),
});

const jsonBody = (schema: ZodType) => ({
  content: { "application/json": { schema } },
});

const jsonResponse = (description: string, schema?: ZodType) => ({
  description,
  ...(schema ? jsonBody(schema) : {}),
});

// Helper que registra os 5 endpoints padrão de um CRUD sem repetição de código
function registrarCrud({
  tag,
  path,
  nomeModelo,
  schema,
  respostaExtra,
  unico,
}: {
  tag: string;
  path: string;
  nomeModelo: string;
  schema: ZodType;
  // Campos que a API devolve além dos do schema (ex.: o post já vem com autor e categoria)
  respostaExtra?: Record<string, ZodType>;
  // Texto do campo @unique, para documentar o erro 409
  unico?: string;
}) {
  const model = registry.register(
    nomeModelo,
    (schema as any).extend({
      id: z.number().openapi({ example: 1 }),
      ...(respostaExtra ?? {}),
    }),
  );

  const erro409 = unico ? { 409: jsonResponse(`Já existe um registro com este ${unico}`) } : {};

  // GET /recurso (Listagem)
  registry.registerPath({
    method: "get",
    path,
    summary: `Lista ${tag.toLowerCase()}`,
    tags: [tag],
    responses: { 200: jsonResponse("Lista retornada com sucesso", z.array(model)) },
  });

  // GET /recurso/{id} (Buscar por ID)
  registry.registerPath({
    method: "get",
    path: `${path}/{id}`,
    summary: `Busca ${nomeModelo.toLowerCase()} por ID`,
    tags: [tag],
    request: { params: idParam },
    responses: {
      200: jsonResponse(`${nomeModelo} encontrado`, model),
      400: jsonResponse("ID inválido"),
      404: jsonResponse("Não encontrado"),
    },
  });

  // POST /recurso (Cadastro)
  registry.registerPath({
    method: "post",
    path,
    summary: `Cadastra novo ${nomeModelo.toLowerCase()}`,
    tags: [tag],
    request: { body: jsonBody(schema) },
    responses: {
      201: jsonResponse("Cadastrado com sucesso", model),
      400: jsonResponse("Erro de validação"),
      ...erro409,
    },
  });

  // PUT /recurso/{id} (Atualização)
  registry.registerPath({
    method: "put",
    path: `${path}/{id}`,
    summary: `Atualiza ${nomeModelo.toLowerCase()}`,
    tags: [tag],
    request: { params: idParam, body: jsonBody(schema) },
    responses: {
      200: jsonResponse("Atualizado com sucesso", model),
      400: jsonResponse("Dados inválidos"),
      404: jsonResponse("Não encontrado"),
      ...erro409,
    },
  });

  // DELETE /recurso/{id} (Remoção)
  registry.registerPath({
    method: "delete",
    path: `${path}/{id}`,
    summary: `Remove ${nomeModelo.toLowerCase()}`,
    tags: [tag],
    request: { params: idParam },
    responses: {
      204: jsonResponse("Removido com sucesso"),
      400: jsonResponse("ID inválido"),
      404: jsonResponse("Não encontrado"),
    },
  });

  return model;
}

// -------------------------------------------------------------
// 2. Registro declarativo de cada recurso (1 chamada por CRUD!)
// -------------------------------------------------------------
const autorModel = registrarCrud({
  tag: "Autores",
  path: "/autores",
  nomeModelo: "Autor",
  schema: autorSchema,
  unico: "e-mail",
});

const categoriaModel = registrarCrud({
  tag: "Categorias",
  path: "/categorias",
  nomeModelo: "Categoria",
  schema: categoriaSchema,
  unico: "nome",
});

registrarCrud({
  tag: "Posts",
  path: "/posts",
  nomeModelo: "Post",
  schema: postSchema,
  respostaExtra: { autor: autorModel, categoria: categoriaModel },
});

registrarCrud({
  tag: "Comentários",
  path: "/comentarios",
  nomeModelo: "Comentario",
  schema: comentarioSchema,
  respostaExtra: {
    post: z.object({ id: z.number(), titulo: z.string() }).openapi({ example: { id: 1, titulo: "Introdução ao Prisma" } }),
  },
});

// Cadastro de usuário (fora do CRUD): a senha só entra, nunca sai
const usuarioModel = registry.register(
  "Usuario",
  usuarioSchema.extend({ id: z.number().openapi({ example: 1 }) }),
);

registry.registerPath({
  method: "post",
  path: "/usuarios",
  summary: "Cadastra um novo usuário",
  tags: ["Autenticação"],
  request: { body: jsonBody(cadastroUsuarioSchema) },
  responses: {
    201: jsonResponse("Usuário cadastrado (sem a senha)", usuarioModel),
    400: jsonResponse("Erro de validação"),
    409: jsonResponse("Já existe um usuário com este e-mail"),
  },
});

// Login: valida e-mail + senha e devolve o usuário
registry.registerPath({
  method: "post",
  path: "/auth/login",
  summary: "Autentica um usuário por e-mail e senha",
  tags: ["Autenticação"],
  request: { body: jsonBody(loginSchema) },
  responses: {
    200: jsonResponse("Login realizado", usuarioModel),
    400: jsonResponse("Erro de validação"),
    401: jsonResponse("E-mail ou senha inválidos"),
  },
});

// -------------------------------------------------------------
// 3. Gerador do Documento OpenAPI 3.0
// -------------------------------------------------------------
const generator = new OpenApiGeneratorV3(registry.definitions);

export const swaggerSpec = generator.generateDocument({
  openapi: "3.0.0",
  info: {
    title: "API do Blog",
    version: "1.0.0",
    description: "Documentação automática gerada a partir dos Schemas do Zod.",
  },
  servers: [{ url: "http://localhost:3000", description: "Servidor Local" }],
});
