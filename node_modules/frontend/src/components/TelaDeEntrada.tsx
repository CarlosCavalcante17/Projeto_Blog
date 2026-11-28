import type { ReactNode } from 'react'
import { Box, Center, Group, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { IconBook2 } from '@tabler/icons-react'

// Moldura do Login e do Cadastro: faixa do blog à esquerda, formulário à direita
export function TelaDeEntrada({ children }: { children: ReactNode }) {
  return (
    <Box mih="100vh" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 5fr) minmax(0, 7fr)' }} className="tela-de-entrada">
      <Stack justify="space-between" p={48} bg="clinica.9" c="white" className="faixa-da-clinica">
        <Group gap="sm">
          <ThemeIcon size={40} radius="md" color="clinica.5" variant="filled">
            <IconBook2 size={24} />
          </ThemeIcon>
          <Text fw={700} fz="lg">Blog</Text>
        </Group>

        <Box maw={360}>
          <Title order={2} fz={40} lh={1.1} c="white" mb="md">
            Toda a redação do blog num lugar só.
          </Title>
          <Text c="clinica.1" fz="lg">
            Cadastre autores e categorias, publique posts e acompanhe os comentários.
          </Text>
        </Box>

        <Text c="clinica.1" fz="sm">Escreva, organize e publique.</Text>
      </Stack>

      <Center p="xl" bg="white">
        {children}
      </Center>
    </Box>
  )
}
