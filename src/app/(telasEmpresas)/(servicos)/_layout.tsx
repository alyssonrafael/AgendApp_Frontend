import { Stack } from "expo-router";

export default function servicosLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="cadastroServico" options={{ title: "Cadastro de Serviços" }} />
      <Stack.Screen name="detalheServico" options={{ title: "Detalhes do Serviços" }} />
      <Stack.Screen name="edicaoServico" options={{ title: "Edição do Serviços" }} />
    </Stack>
  );
}
