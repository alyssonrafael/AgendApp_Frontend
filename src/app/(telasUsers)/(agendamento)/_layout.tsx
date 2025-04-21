import { Stack } from "expo-router";

export default function maisOpcoesUserLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="empresa" options={{ title: "Detalhes e serviços" }} />
      <Stack.Screen name="detalhesAgendamento" options={{ title: "Finalizar agendamento" }} />
    </Stack>
  );
}
