import { Stack } from "expo-router";

export default function maisOpcoesEmpresaLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="sobre" options={{ title: "Sobre" }} />
      <Stack.Screen name="perfil" options={{ title: "Perfil" }} />
      <Stack.Screen name="editarPerfil" options={{ title: "Editar Perfil" }} />
      <Stack.Screen name="relatorios" options={{ title: "Relatórios" }} />
    </Stack>
  );
}
