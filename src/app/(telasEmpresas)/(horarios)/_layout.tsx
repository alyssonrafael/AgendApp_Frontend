import { AgendamentosProvider } from "@/src/context/AgendamentosEmpresaContext";
import { Stack } from "expo-router";

export default function horariosLayout() {
  return (
    <>
      {/* Provide do contexto com os agendamentos da empresa logada */}
      <AgendamentosProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="agendamentosDoDia"
            options={{ title: "Agendamentos do dia" }}
          />
          <Stack.Screen
            name="todosAgendamentos"
            options={{ title: "Todos os agendamentos" }}
          />
          <Stack.Screen
            name="gerenciarGrade"
            options={{ title: "Gerenciar grade de horários" }}
          />
        </Stack>
      </AgendamentosProvider>
    </>
  );
}
