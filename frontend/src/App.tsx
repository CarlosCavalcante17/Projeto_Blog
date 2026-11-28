import { useState } from "react";
import { TelaDeEntrada } from "./components/TelaDeEntrada.tsx";
import { LoginPage } from "./pages/LoginPage.tsx";
import { CadastroUsuarioPage } from "./pages/CadastroUsuarioPage.tsx";
import { HomePage } from "./pages/HomePage.tsx";

function App() {
  const [tela, setTela] = useState("login");
  const [nome, setNome] = useState("");

  if (tela === "home")
    return <HomePage nome={nome} onSair={() => setTela("login")} />;

  return (
    <TelaDeEntrada>
      {tela === "login" && (
        <LoginPage
          onIrParaCadastro={() => setTela("cadastro")}
          onEntrar={(nomeDeQuemEntrou) => {
            setNome(nomeDeQuemEntrou);
            setTela("home");
          }}
        />
      )}
      {tela === "cadastro" && (
        <CadastroUsuarioPage onVoltarParaLogin={() => setTela("login")} />
      )}
    </TelaDeEntrada>
  );
}

export default App;
