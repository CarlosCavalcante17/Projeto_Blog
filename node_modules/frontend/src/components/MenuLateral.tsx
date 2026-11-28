import type { ReactNode } from 'react'
import { AppShell, Avatar, Box, Burger, Button, Group, NavLink, Stack, Text, ThemeIcon } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconArticle, IconBook2, IconLogout, IconMessageCircle, IconTag, IconUsers } from '@tabler/icons-react'

type Props = {
  nome: string
  onSair: () => void
  pagina: string // qual item do menu está marcado
  onTrocarPagina: (pagina: string) => void
  children: ReactNode
}

// Os itens do menu: uma tela para cada tabela do sistema
const itens = [
  { valor: 'posts', rotulo: 'Posts', icone: <IconArticle size={20} stroke={1.75} /> },
  { valor: 'comentarios', rotulo: 'Comentários', icone: <IconMessageCircle size={20} stroke={1.75} /> },
  { valor: 'autores', rotulo: 'Autores', icone: <IconUsers size={20} stroke={1.75} /> },
  { valor: 'categorias', rotulo: 'Categorias', icone: <IconTag size={20} stroke={1.75} /> },
]

// Moldura das telas de dentro: menu escuro à esquerda (no celular, atrás do ☰) e o conteúdo no meio
export function MenuLateral({ nome, onSair, pagina, onTrocarPagina, children }: Props) {
  const [menuAberto, { toggle: alternarMenu, close: fecharMenu }] = useDisclosure()

  function abrir(novaPagina: string) {
    onTrocarPagina(novaPagina)
    fecharMenu() // no celular, fecha o menu depois de escolher
  }

  return (
    <AppShell
      navbar={{ width: 240, breakpoint: 'sm', collapsed: { mobile: !menuAberto } }}
      header={{ height: { base: 56, sm: 0 } }}
      padding={{ base: 'md', sm: 32 }}
    >
      <AppShell.Header hiddenFrom="sm" bg="clinica.9" withBorder={false}>
        <Group h="100%" px="md" gap="sm">
          <Burger opened={menuAberto} onClick={alternarMenu} color="white" size="sm" aria-label="Abrir menu" />
          <Text c="white" fw={700}>Blog</Text>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar bg="clinica.9" c="white" p="md" withBorder={false}>
        <Group gap="sm" mb={32} visibleFrom="sm">
          <ThemeIcon size={36} radius="md" color="clinica.5">
            <IconBook2 size={20} />
          </ThemeIcon>
          <Text fw={700} fz="lg">Blog</Text>
        </Group>

        <Stack gap={4} style={{ flex: 1 }}>
          {itens.map((item) => (
            <NavLink
              key={item.valor}
              label={item.rotulo}
              leftSection={item.icone}
              active={pagina === item.valor}
              onClick={() => abrir(item.valor)}
              variant="filled"
              color="clinica.7"
              c={pagina === item.valor ? 'white' : 'clinica.1'}
              style={{ borderRadius: 8 }}
            />
          ))}
        </Stack>

        <Box pt="md" style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
          <Group gap="sm" mb="sm" wrap="nowrap">
            <Avatar color="clinica.3" variant="filled" radius="xl">{nome[0]}</Avatar>
            <Box style={{ minWidth: 0 }}>
              <Text fw={700} size="sm" truncate>{nome}</Text>
              <Text size="xs" c="clinica.1">Redação</Text>
            </Box>
          </Group>
          <Button fullWidth variant="subtle" color="gray.0" justify="flex-start" leftSection={<IconLogout size={18} />} onClick={onSair}>
            Sair
          </Button>
        </Box>
      </AppShell.Navbar>

      <AppShell.Main bg="#f2f7f6">
        <Box maw={1080}>{children}</Box>
      </AppShell.Main>
    </AppShell>
  )
}
