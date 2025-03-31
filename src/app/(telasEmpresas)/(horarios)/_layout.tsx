import { Stack } from "expo-router";

export default function horariosLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="agendamentosDoDia" options={{ title: "Agendamentos do dia" }} />
      <Stack.Screen name="todosAgendamentos" options={{ title: "Todos os agendamentos" }} />
      <Stack.Screen name="gerenciarGrade" options={{ title: "Gerenciar grade de horários" }} />
    </Stack>
  );
}
