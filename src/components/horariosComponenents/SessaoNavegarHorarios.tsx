import React from "react";
import { ThemedOptionItem } from "../ThemedOptionItem";
import { router } from "expo-router";
//componente que inclui opçoes de rotas na pagina de horarios para verificar os agendamentos e gerenciar a grade de horarios
export default function SessaoNavegarHorarios() {
  return (
    <>
      <ThemedOptionItem
        iconName="cog-outline"
        text="Gerenciar grade de horários"
        onPress={() => {
          router.push("/(telasEmpresas)/(horarios)/gerenciarGrade");
        }}
      />
      <ThemedOptionItem
        iconName="reader-outline"
        text="Todos os agendamentos"
        onPress={() => {
          router.push("/(telasEmpresas)/(horarios)/todosAgendamentos");
        }}
      />
      <ThemedOptionItem
        iconName="reader-outline"
        text="Agendamentos do Dia"
        onPress={() => {
          router.push("/(telasEmpresas)/(horarios)/agendamentosDoDia");
        }}
      />
    </>
  );
}
