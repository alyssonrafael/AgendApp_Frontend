import { EmpresaServiceProvider } from "@/src/context/EmpresaServiceContext";
import { Stack } from "expo-router";

export default function servicosLayout() {
  return (
    <>
    {/* Provide do contexto com os serviços da empresa logada */}
    <EmpresaServiceProvider>
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="cadastroServico" options={{ title: "Cadastro de Serviços" }} />
      <Stack.Screen name="detalheServico" options={{ title: "Detalhes do Serviços" }} />
      <Stack.Screen name="edicaoServico" options={{ title: "Edição do Serviços" }} />
    </Stack>
    </EmpresaServiceProvider>
    </>
  );
}
