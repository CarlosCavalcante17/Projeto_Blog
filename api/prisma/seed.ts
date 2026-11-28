import bcrypt from "bcryptjs";
import { prisma } from "../src/config/prisma.js";

// upsert pelo campo único (e-mail / nome): rodar o seed de novo não duplica ninguém.

// ---------- Usuário para o professor entrar no sistema ----------
const usuarioProfessor = {
  nome: "Professor",
  email: "professor@blog.com",
  senha: "Professor@123",
};

await prisma.usuario.upsert({
  where: { email: usuarioProfessor.email },
  update: {},
  create: {
    nome: usuarioProfessor.nome,
    email: usuarioProfessor.email,
    senha: await bcrypt.hash(usuarioProfessor.senha, 10),
  },
});

// ---------- Autores ----------
const autoresData = [
  { nome: "Carlos Cavalcante", email: "carlos@blog.com", bio: "Desenvolvedor full stack e escritor de tutoriais." },
  { nome: "Mariana Souza", email: "mariana@blog.com", bio: "Designer de interfaces apaixonada por acessibilidade." },
  { nome: "Rafael Moura", email: "rafael@blog.com", bio: "Engenheiro de dados e entusiasta de código aberto." },
  { nome: "Juliana Rocha", email: "juliana@blog.com", bio: "Professora de programação e criadora de conteúdo." },
];

const autoresPorEmail = new Map<string, number>();
for (const autor of autoresData) {
  const salvo = await prisma.autor.upsert({
    where: { email: autor.email },
    update: { nome: autor.nome, bio: autor.bio },
    create: autor,
  });
  autoresPorEmail.set(salvo.email, salvo.id);
}

// ---------- Categorias ----------
const categoriasData = [
  { nome: "Tecnologia", descricao: "Novidades, dicas e tutoriais de tecnologia." },
  { nome: "Design", descricao: "Interfaces, usabilidade e boas práticas visuais." },
  { nome: "Carreira", descricao: "Conselhos para quem está começando na área." },
  { nome: "Dados", descricao: "Bancos de dados, análises e engenharia de dados." },
];

const categoriasPorNome = new Map<string, number>();
for (const categoria of categoriasData) {
  const salva = await prisma.categoria.upsert({
    where: { nome: categoria.nome },
    update: { descricao: categoria.descricao },
    create: categoria,
  });
  categoriasPorNome.set(salva.nome, salva.id);
}

// ---------- Posts ----------
const postsData = [
  { titulo: "Introdução ao Prisma", conteudo: "Neste post vamos ver como modelar um banco de dados com o Prisma ORM.", publicado: true, email: "carlos@blog.com", categoria: "Tecnologia" },
  { titulo: "Validando dados com Zod", conteudo: "O Zod permite validar dados na API e no frontend com o mesmo schema.", publicado: true, email: "carlos@blog.com", categoria: "Tecnologia" },
  { titulo: "Acessibilidade na prática", conteudo: "Pequenas mudanças de contraste e fonte tornam o site melhor para todos.", publicado: true, email: "mariana@blog.com", categoria: "Design" },
  { titulo: "Cores e contraste em interfaces", conteudo: "Como escolher uma paleta que seja bonita e também fácil de ler.", publicado: false, email: "mariana@blog.com", categoria: "Design" },
  { titulo: "Primeiro emprego em tecnologia", conteudo: "Dicas para montar um portfólio e se preparar para as entrevistas.", publicado: true, email: "juliana@blog.com", categoria: "Carreira" },
  { titulo: "Modelagem relacional sem medo", conteudo: "Chaves primárias, chaves estrangeiras e relacionamentos explicados com exemplos.", publicado: true, email: "rafael@blog.com", categoria: "Dados" },
  { titulo: "Do CSV ao dashboard", conteudo: "Um passo a passo para transformar uma planilha em uma análise visual.", publicado: false, email: "rafael@blog.com", categoria: "Dados" },
  { titulo: "Como estudar programação", conteudo: "Um plano de estudos simples para manter a constância ao longo do semestre.", publicado: true, email: "juliana@blog.com", categoria: "Carreira" },
];

const postsPorTitulo = new Map<string, number>();
for (const post of postsData) {
  const autorId = autoresPorEmail.get(post.email)!;
  const categoriaId = categoriasPorNome.get(post.categoria)!;
  const existente = await prisma.post.findFirst({ where: { titulo: post.titulo, autorId } });
  const salvo = existente
    ? existente
    : await prisma.post.create({
        data: { titulo: post.titulo, conteudo: post.conteudo, publicado: post.publicado, autorId, categoriaId },
      });
  postsPorTitulo.set(post.titulo, salvo.id);
}

// ---------- Comentários ----------
const comentariosData = [
  { leitor: "Ana Beatriz", texto: "Ótimo post, me ajudou bastante!", post: "Introdução ao Prisma" },
  { leitor: "Bruno Henrique", texto: "Consegui rodar o exemplo de primeira.", post: "Introdução ao Prisma" },
  { leitor: "Camila Ferreira", texto: "Agora entendi a diferença entre parse e safeParse.", post: "Validando dados com Zod" },
  { leitor: "Diego Martins", texto: "Muito importante falar de acessibilidade.", post: "Acessibilidade na prática" },
  { leitor: "Eduarda Silva", texto: "Vou aplicar essas dicas no meu portfólio.", post: "Primeiro emprego em tecnologia" },
  { leitor: "Felipe Nogueira", texto: "Finalmente entendi chave estrangeira.", post: "Modelagem relacional sem medo" },
  { leitor: "Gabriela Duarte", texto: "Plano de estudos muito realista, obrigada!", post: "Como estudar programação" },
  { leitor: "Henrique Castro", texto: "Salvei para ler com calma no fim de semana.", post: "Como estudar programação" },
];

let comentariosCriados = 0;
for (const comentario of comentariosData) {
  const postId = postsPorTitulo.get(comentario.post)!;
  const existente = await prisma.comentario.findFirst({
    where: { leitor: comentario.leitor, texto: comentario.texto, postId },
  });
  if (!existente) {
    await prisma.comentario.create({
      data: { leitor: comentario.leitor, texto: comentario.texto, postId },
    });
    comentariosCriados++;
  }
}

console.log(
  `Seed concluído: 1 usuário, ${autoresData.length} autores, ${categoriasData.length} categorias, ${postsData.length} posts e ${comentariosData.length} comentários (${comentariosCriados} novos).`,
);
await prisma.$disconnect();
