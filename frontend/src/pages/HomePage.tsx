import { useState } from "react";
import { MenuLateral } from "../components/MenuLateral";
import { PostsPage } from "./PostsPage";
import { ComentariosPage } from "./ComentariosPage";
import { AutoresPage } from "./AutoresPage";
import { CategoriasPage } from "./CategoriasPage";

type Props = {
  nome: string;
  onSair: () => void;
};

export function HomePage({ nome, onSair }: Props) {
  // Qual tela aparece no meio: "posts", "comentarios", "autores" ou "categorias"
  const [pagina, setPagina] = useState("posts");

  return (
    <MenuLateral nome={nome} onSair={onSair} pagina={pagina} onTrocarPagina={setPagina}>
      {pagina === "posts" && <PostsPage />}
      {pagina === "comentarios" && <ComentariosPage />}
      {pagina === "autores" && <AutoresPage />}
      {pagina === "categorias" && <CategoriasPage />}
    </MenuLateral>
  );
}
