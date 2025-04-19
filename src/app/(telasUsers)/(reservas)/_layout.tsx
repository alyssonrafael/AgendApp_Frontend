import { Stack } from "expo-router";

export default function maisOpcoesUserLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="todasReservas" options={{ title: "Histórico de Agendamentos" }} />
    </Stack>
  );
}
