// src/components/IndisponibilidadesManager.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useGradeHorarios } from "@/src/context/GradeHorariosContext";
import { useMessage } from "@/src/context/MessageContext";
import { ThemedInput } from "../ThemedInput";
import { ThemedButton } from "../ThemedButton";
import { ThemedText } from "@/src/components/ThemedText";
import { ThemedView } from "@/src/components/ThemedView";
import { ThemedLoadingIndicator } from "../ThemedLoadingIndicator";
import { IndisponibilidadeModal } from "./IndisponibilidadeModal";
import { IndisponibilidadeCard } from "./IndisponibilidadeCard";
import { Ionicons } from "@expo/vector-icons";

export function IndisponibilidadesManager() {
  // Extração de funções e dados do contexto
  const {
    indisponibilidades,
    fetchIndisponibilidades,
    refreshHorarios,
    removeIndisponibilidade,
    loading,
  } = useGradeHorarios();
  // Estados locais
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  // funçao do contexto para mensagem de feedback
  const { showMessage } = useMessage();

  // Busca as indisponibilidades quando o componente é montado
  useEffect(() => {
    fetchIndisponibilidades();
  }, []);

  // Define o item a ser excluído e abre o modal de confirmação
  const handleRemoveClick = (id: string) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };
  // Confirmação da exclusão do item
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setShowDeleteModal(false);
      await removeIndisponibilidade(itemToDelete);
      showMessage("success", "Indisponibilidade removida com sucesso!");
    } catch (error) {
      showMessage("danger", "Erro ao remover indisponibilidade");
    } finally {
      setItemToDelete(null);
    }
  };
  // Filtra a lista com base na busca (por id)
  const filteredIndisponibilidades = indisponibilidades.filter((item) =>
    item.id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <ThemedView style={styles.container}>
        <ThemedInput
          placeholder="Buscar por id ..."
          type="outlined"
          icon={<Ionicons name="search" size={20} color="#666" />}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {/* Lista de indisponibilidades */}
        <View style={styles.listaContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <ThemedText type="subtitle" style={styles.subtitle}>
              Gerencie os períodos em que não estará disponível.
            </ThemedText>
            {/* Estados possíveis: carregando, sem itens ou lista renderizada */}
            {loading ? (
              <ThemedLoadingIndicator message="Carregando indisponibilidades.." />
            ) : filteredIndisponibilidades.length === 0 ? (
              <ThemedText style={styles.emptyText}>
                {searchQuery
                  ? "Nenhuma indisponibilidade encontrada"
                  : "Nenhuma indisponibilidade cadastrada"}
              </ThemedText>
            ) : (
              filteredIndisponibilidades.map((item) => (
                <IndisponibilidadeCard
                  key={item.id}
                  id={item.id}
                  data={item.data}
                  horario={item.horario}
                  motivo={item.motivo}
                  onRemove={handleRemoveClick}
                />
              ))
            )}
          </ScrollView>
        </View>
        {/* Botão para abrir o modal de criação */}
        <ThemedButton
          icon={
            <Ionicons name="add-circle-outline" size={20} color={"white"} />
          }
          textStyle={{ fontSize: 16 }}
          style={styles.addButton}
          iconPosition="left"
          onPress={() => setModalVisible(true)}
          title="Adicionar Indisponibilidade"
        />
      </ThemedView>
      {/* Modal de criação */}
      <IndisponibilidadeModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={refreshHorarios}
      />
      {/* Modal de confirmação de remoção */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.deleteModalOverlay}>
          <ThemedView style={styles.deleteModalContainer}>
            <ThemedText type="subtitle" style={styles.deleteModalTitle}>
              Confirmar Exclusão
            </ThemedText>
            <ThemedText style={styles.deleteModalText}>
              Tem certeza que deseja remover esta indisponibilidade?
            </ThemedText>

            <View style={styles.deleteModalButtons}>
              {/* Botão cancelar */}
              <TouchableOpacity
                style={[
                  styles.deleteModalButton,
                  styles.deleteModalCancelButton,
                ]}
                onPress={() => setShowDeleteModal(false)}
              >
                <ThemedText style={styles.deleteModalButtonText}>
                  Cancelar
                </ThemedText>
              </TouchableOpacity>
              {/* Botão confirmar */}
              <TouchableOpacity
                style={[
                  styles.deleteModalButton,
                  styles.deleteModalConfirmButton,
                ]}
                onPress={handleConfirmDelete}
              >
                <ThemedText style={styles.deleteModalButtonText}>
                  Remover
                </ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 16,
    paddingHorizontal: 4,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 16,
  },
  listaContainer: {
    flex: 1,
    marginBottom: 16,
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    padding: 20,
    fontSize: 14,
    marginTop: 20,
  },
  addButton: {
    marginTop: 0,
    marginBottom: 0,
  },
  deleteModalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  deleteModalContainer: {
    width: "100%",
    borderRadius: 10,
    padding: 20,
  },
  deleteModalTitle: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 18,
  },
  deleteModalText: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 16,
  },
  deleteModalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  deleteModalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  deleteModalCancelButton: {
    backgroundColor: "#007BFF",
  },
  deleteModalConfirmButton: {
    backgroundColor: "#FF3B30",
  },
  deleteModalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
