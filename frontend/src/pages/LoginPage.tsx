import { useState } from "react";
import { Alert, Anchor, Box, Button, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core";
import { login } from "../services/api.ts";
import { loginSchema } from "@blog/shared/auth";
import { lerErroDaApi, validarCampos, type ErrosDosCampos } from "../erros.ts";

type Props = {
  onIrParaCadastro: () => void;
  onEntrar: (nome: string) => void;
};

export function LoginPage({ onEntrar, onIrParaCadastro }: Props) {
  // O que a pessoa digitou
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  // O que vamos mostrar na tela
  const [erro, setErro] = useState("");
  const [erros, setErros] = useState<ErrosDosCampos>({});
  const [carregando, setCarregando] = useState(false);

  async function entrar() {
    // Apaga as mensagens da tentativa anterior
    setErro("");
    setErros({});

    // fail fast: confere aqui mesmo, com as mesmas regras da API
    const errosDeValidacao = validarCampos(loginSchema, { email, senha });
    if (errosDeValidacao) {
      setErros(errosDeValidacao);
      return;
    }

    setCarregando(true);
    try {
      const usuario = await login({ email, senha });
      onEntrar(usuario.nome);
    } catch (e) {
      const { mensagem, porCampo } = lerErroDaApi(e);
      setErro(mensagem);
      setErros(porCampo);
    }
    setCarregando(false);
  }

  return (
    <Box w="100%" maw={380}>
      <Title order={1} fz={32}>
        Entrar
      </Title>
      <Text c="dimmed" mb="xl">
        Acesse com seu e-mail e senha
      </Text>

      <form
        onSubmit={(evento) => {
          evento.preventDefault();
          entrar();
        }}
      >
        <Stack>
          {erro && <Alert color="red">{erro}</Alert>}

          <TextInput
            label="E-mail"
            placeholder="voce@exemplo.com"
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
            error={erros.email}
          />
          <PasswordInput
            label="Senha"
            placeholder="Sua senha"
            value={senha}
            onChange={(evento) => setSenha(evento.target.value)}
            error={erros.senha}
          />

          <Button type="submit" loading={carregando}>
            Entrar
          </Button>

          <Text size="sm" ta="center">
            Ainda não tem conta?{" "}
            <Anchor component="button" type="button" onClick={onIrParaCadastro}>
              Cadastre-se
            </Anchor>
          </Text>
        </Stack>
      </form>
    </Box>
  );
}
