import React, { useState } from 'react';
import { Modal, View, TouchableOpacity, StyleSheet, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useAgendamentos } from '../../context/AgendamentosEmpresaContext';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { ThemedButton } from '../ThemedButton';
import { useThemeColor } from '@/src/hooks/useThemeColor';


export const ModalDetalhes: React.FC = () => {
  const { agendamentoSelecionado, setAgendamentoSelecionado } = useAgendamentos(); //recupera o agendamento selecionado
  const [showCopiedPopup, setShowCopiedPopup] = useState(false); //contorole da exibição do popup de copia
  const [popupMessage, setPopupMessage] = useState(''); // mensagem do popup
  const popupOpacity = useState(new Animated.Value(0))[0]; // estado que controla a opacidade do popup

  //cor personalizada para o fundo do popup
  const backgroundPopupColor = useThemeColor(
    { light: "#fff", dark: "#121212" },
    "background"
  );
//funçao que copia o texto para a area de trasferencia e exibe o popup indicando que foi copiado
  const copyToClipboard = async (text: string, type: string) => {
    await Clipboard.setStringAsync(text);
    setPopupMessage(`${type} copiado!`);
    showPopup();
  };
//anomaçao do popup
  const showPopup = () => {
    setShowCopiedPopup(true);
    Animated.sequence([
      Animated.timing(popupOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(1500),
      Animated.timing(popupOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setShowCopiedPopup(false));
  };

  //verifica se ha um agendamento selecionado
  if (!agendamentoSelecionado) return null;
  
  return (
    //retorna o modal com os detalhes do agendamento selecionado caso seja nulo nao exibe
    <Modal
      visible={!!agendamentoSelecionado}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setAgendamentoSelecionado(null)}
      statusBarTranslucent
    >
      {/* Overlay que fecha o modal ao clicar */}
      <Pressable 
        style={styles.modalOverlay} 
        onPress={() => setAgendamentoSelecionado(null)}
      >
        {/* Conteúdo do modal - evita que o clique propague para o overlay */}
        <Pressable style={styles.modalPressable}>
          <ThemedView style={styles.modalContainer}>
            {/* Cabeçalho */}
            <View style={styles.header}>
              <ThemedText type='title' style={{fontSize:20}}>Detalhes do Agendamento</ThemedText>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setAgendamentoSelecionado(null)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Conteúdo em seções organizadas */}
            <View style={styles.section}>
              <ThemedText type='subtitle'>Cliente</ThemedText>
              <View style={styles.infoRow}>
                <Ionicons name="person-outline" size={16} color="#666" style={styles.icon} />
                <ThemedText>{agendamentoSelecionado.cliente.nome}</ThemedText>
              </View>
              
              <TouchableOpacity 
                style={styles.infoRow} 
                onPress={() => copyToClipboard(agendamentoSelecionado.cliente.email, 'E-mail')}
              >
                <Ionicons name="mail-outline" size={16} color="#666" style={styles.icon} />
                <ThemedText>{agendamentoSelecionado.cliente.email}</ThemedText>
                <Ionicons name="copy-outline" size={16} color="#666" style={styles.copyIcon} />
              </TouchableOpacity>
              
              {agendamentoSelecionado.cliente.telefone && (
                <TouchableOpacity 
                  style={styles.infoRow} 
                  onPress={() => copyToClipboard(agendamentoSelecionado.cliente.telefone, 'Telefone')}
                >
                  <Ionicons name="call-outline" size={16} color="#666" style={styles.icon} />
                  <ThemedText>{agendamentoSelecionado.cliente.telefone}</ThemedText>
                  <Ionicons name="copy-outline" size={16} color="#666" style={styles.copyIcon} />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
              <ThemedText type='subtitle'>Agendamento</ThemedText>
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={16} color="#666" style={styles.icon} />
                <ThemedText>{agendamentoSelecionado.dataFormatada}</ThemedText>
              </View>
              
              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={16} color="#666" style={styles.icon} />
                <ThemedText>{agendamentoSelecionado.horario}</ThemedText>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
              <ThemedText type='subtitle'>Serviço</ThemedText>
              <View style={styles.infoRow}>
                <Ionicons name="briefcase-outline" size={16} color="#666" style={styles.icon} />
                <ThemedText>{agendamentoSelecionado.servico.nome}</ThemedText>
              </View>
              
              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={16} color="#666" style={styles.icon} />
                <ThemedText>{agendamentoSelecionado.servico.duracao} minutos</ThemedText>
              </View>
              
              <View style={styles.infoRow}>
                <Ionicons name="cash-outline" size={16} color="#666" style={styles.icon} />
                <ThemedText>R$ {agendamentoSelecionado.servico.custo.toFixed(2)}</ThemedText>
              </View>
            </View>

            {/* Botão de fechar no rodapé */}
            <ThemedButton 
              title="Fechar"
              onPress={() => setAgendamentoSelecionado(null)}
              style={styles.closeBottomButton}
            />
            
            {/* Popup de confirmação de cópia so e exibido se algo for copiado  */}
            {showCopiedPopup && (
              <Animated.View style={[styles.popupContainer, { opacity: popupOpacity }]}>
                <ThemedView style={[styles.popupContent, {backgroundColor:backgroundPopupColor }]}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  <ThemedText style={styles.popupText}>{popupMessage}</ThemedText>
                </ThemedView>
              </Animated.View>
            )}
          </ThemedView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
  },
  modalPressable: {
    width: '100%',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 12,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  closeButton: {
    padding: 4,
  },
  section: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    paddingVertical: 4,
  },
  icon: {
    marginRight: 10,
    width: 20,
  },
  copyIcon: {
    marginLeft: 'auto',
    paddingLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  closeBottomButton: {
    marginTop: 16,
    alignSelf: 'center',
  },
  popupContainer: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  popupContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#D3d3d3',
  },
  popupText: {
    marginLeft: 8,
    color: '#4CAF50',
    fontSize: 14,
  },
});