import { useState } from "react";
import { Alert, Anchor, Box, Button, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core";
import { cadastroUsuarioSchema } from "@blog/shared/usuario";
import { cadastrarUsuario } from "../services/api.ts";
import { lerErroDaApi, validarCampos, type ErrosDosCampos } from "../erros.ts";

type Props = {
  onVoltarParaLogin: () => void;
};

export function CadastroUsuarioPage({ onVoltarParaLogin }: Props) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [erro, setErro] = useState("");
  const [erros, setErros] = useState<ErrosDosCampos>({});
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function cadastrar() {
    setErro("");
    setErros({});
    setSucesso("");

    if (senha !== confirmarSenha) {
      setErros({ confirmarSenha: "As senhas não conferem" });
      return;
    }

    // Confere o formato aqui mesmo, com as mesmas regras da API
    const errosDeValidacao = validarCampos(cadastroUsuarioSchema, { nome, email, senha });
    if (errosDeValidacao) {
      setErros(errosDeValidacao);
      return; // não chama a API
    }

    setCarregando(true);
    try {
      const usuario = await cadastrarUsuario({ nome, email, senha });
      setSucesso(`${usuario.nome} foi cadastrado(a) com sucesso! Já pode entrar.`);
      setNome("");
      setEmail("");
      setSenha("");
      setConfirmarSenha("");
    } catch (e) {
      const { mensagem, porCampo } = lerErroDaApi(e);
      setErro(mensagem);
      setErros(porCampo);
    }
    setCarregando(false);
  }

  return (
    <Box w="100%" maw={420}>
      <Title order={1} fz={32}>
        Criar conta
      </Title>
      <Text c="dimmed" mb="xl">
        Para quem escreve e organiza o blog
      </Text>
      <form
        onSubmit={(evento) => {
          evento.preventDefault();
          cadastrar();
        }}
      >
        <Stack>
          {sucesso && <Alert color="green">{sucesso}</Alert>}
          {erro && <Alert color="red">{erro}</Alert>}
          <TextInput label="Nome" value={nome} onChange={(evento) => setNome(evento.target.value)} error={erros.nome} />
          <TextInput label="E-mail" value={email} onChange={(evento) => setEmail(evento.target.value)} error={erros.email} />
          <PasswordInput label="Senha" value={senha} onChange={(evento) => setSenha(evento.target.value)} error={erros.senha} />
          <PasswordInput
            label="Confirmar senha"
            value={confirmarSenha}
            onChange={(evento) => setConfirmarSenha(evento.target.value)}
            error={erros.confirmarSenha}
          />
          <Button type="submit" loading={carregando}>
            Cadastrar
          </Button>
          <Text size="sm" ta="center">
            Já tem conta?{" "}
            <Anchor component="button" type="button" onClick={onVoltarParaLogin}>
              Entrar
            </Anchor>
          </Text>
        </Stack>
      </form>
    </Box>
  );
}
