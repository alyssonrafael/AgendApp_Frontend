import {
  Animated,
  ScrollView,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { ThemedText } from "@/src/components/ThemedText";
import { ThemedButton } from "@/src/components/ThemedButton";
import { useEmpresa } from "@/src/context/EmpresaContext";
import { ThemedInput } from "@/src/components/ThemedInput";
import { useMessage } from "@/src/context/MessageContext";
import { ThemedView } from "@/src/components/ThemedView";
import { TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { apiImages } from "@/src/services/api";

interface FormData {
  // Definição da interface para os dados do formulário
  nomeEmpresa?: string;
  description?: string;
  phoneNumber?: string;
  address?: string;
  image?: string;
  password?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

export default function EditarEmpresa() {
  // Função para manipular a escolha de imagem
  const handleImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync(); // Pede permissão para acessar a galeria
    if (permissionResult.granted === false) {
      showMessage("alert", "Permissão para acessar as imagens foi negada."); // Mensagem de erro se a permissão for negada
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], // Apenas imagens
      allowsEditing: true, // Permite edição da imagem
      aspect: [1, 1], // Formato quadrado
      quality: 1, // Qualidade máxima
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0].uri; // Obtém a URI da imagem selecionada
      await updateImage(selectedImage); // Atualiza a imagem no contexto
      showMessage("success", "Imagem atualizada com sucesso!"); // Exibe mensagem de sucesso
    }
  };

  const {
    empresa, // Dados da empresa
    updateEmpresaName, // Função para atualizar o nome da empresa
    updateDescription, // Função para atualizar a descrição
    updatePhoneNumber, // Função para atualizar o telefone
    updateAddress, // Função para atualizar o endereço 
    updateImage, // Função para atualizar a imagem
    updateEmpresaPassword, // Função para atualizar a senha
    loading, // Estado de carregamento
  } = useEmpresa();

  const { showMessage } = useMessage(); // Função para mostrar mensagens

  // Usando o  useForm para controlar o formulário
  const {
    control,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      nomeEmpresa: empresa?.nomeEmpresa || "",
      description: empresa?.description || "",
      phoneNumber: empresa?.phoneNumber || "",
      address: empresa?.address || "",
      image: empresa?.image || "",
      password: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  // Função para salvar as alterações
  const handleSave = async (data: FormData) => {

    if(
      data.nomeEmpresa === empresa?.nomeEmpresa &&
      !data.password?.trim() &&
      !data.confirmNewPassword?.trim() &&
      !data.phoneNumber?.trim() &&
      !data.address?.trim() &&
      !data.description?.trim()
    ){
      showMessage("info", "Nenhuma alteração foi feita.");
      return;
    }
  
    // Validações de senha
    if (data.password && !data.newPassword) {
      showMessage("alert", "Preencha a nova senha!");
      return;
    }

    if (data.newPassword && !data.password) {
      showMessage("alert", "Preencha sua senha!");
      return;
    }

    if (
      data.newPassword &&
      data.newPassword !== getValues("confirmNewPassword")
    ) {
      showMessage("alert", "As novas senhas não coincidem!");
      return;
    }

    try {
      const updatedFields: string[] = []; // Array para armazenar os campos atualizados
  
      // Atualiza a senha, se password e newpassword for informado
      if (data.password && data.newPassword) {
        const passwordUpdated = await updateEmpresaPassword(
          data.password,
          data.newPassword
        );
        if (passwordUpdated) updatedFields.push("Senha");
      }
  
      // Atualiza o nome da empresa se houve alteração
      if (data.nomeEmpresa && data.nomeEmpresa !== empresa?.nomeEmpresa) {
        const nomeEmpresaUpdated = await updateEmpresaName(data.nomeEmpresa);
        if (nomeEmpresaUpdated) updatedFields.push("Nome empresa")
      }
  
      // Atualiza a descrição se houve alteração e se a descrição não estiver vazia
      if (data.description && data.description !== empresa?.description) {
        const descriptionUpdated = await updateDescription(data.description);
        if (descriptionUpdated) updatedFields.push("Descrição");
      }

      // Atualiza o telefone se houve alteração e se a telefone não estiver vazio
      if (data.phoneNumber && data.phoneNumber !== empresa?.phoneNumber) {
        const phoneNumberUpdated = await updatePhoneNumber(data.phoneNumber);
        if (phoneNumberUpdated) updatedFields.push("Telefone");
      }

      // Atualiza o endereço se houve alteração e se o endereço não estiver vazio
      if (data.address && data.address !== empresa?.address) {
        const addressUpdated = await updateAddress(data.address);
        if (addressUpdated) updatedFields.push("Endereço");
      }
  
      // Exibe a mensagem de sucesso com base nos campos atualizados
      if (updatedFields.length > 0) {
        const camposAtualizados = updatedFields.join(", "); // Junta os campos em uma string
        showMessage(
          "success",
          `Os seguintes campos foram atualizados com sucesso: ${camposAtualizados}.`
        );
      } else {
        showMessage("info", "Nenhuma alteração foi feita.");
      }

      // Reseta o formulário com os novos dados
      reset({
        nomeEmpresa: data.nomeEmpresa,
        description: data.description,
        phoneNumber: data.phoneNumber,
        address: data.address,
        password: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error: any) {
      // Tratamento de erros específicos que vem do contexto
      if (error.message === "Nome da empresa já existe.") {
        showMessage("danger", "Nome da empresa já existe. Escolha outro nome. Nenhum campo atualizado");
      } else if (error.message === "Senha atual incorreta.") {
        showMessage("danger", "Senha atual incorreta! Nenhum dado alterado! Nenhum campo atualizado");
      } else {
        showMessage(
          "danger",
          error.message || "Erro ao atualizar informações."
        );
      }
    }
  };
  // se loading exibe o indicativo
  if (loading) {
    return (
      <ThemedView style={styles.containerloading}>
        <ActivityIndicator size="large" color="#007BFF" />
        <ThemedText>Carregando perfil da empresa...</ThemedText>
      </ThemedView>
    );
  }

  // se nao houver empresa mostra a tela e indica o erro
  if (!empresa) {
    return (
      <ThemedView style={styles.containerloading}>
        <ThemedText style={styles.errorText}>
          Erro ao carregar o perfil. Tente novamente mais tarde.
        </ThemedText>
      </ThemedView>
    );
  }

  // Componente principal de edição da empresa
  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Exibição da imagem da empresa  se houver foto mosta a foto e o pen para ediçao se nao houver fotoo mostra o circulo com a inicial e o pen para ediçao*/}
        <View style={styles.imageContainer}>
          {empresa?.image ? (
            <View style={styles.imageContainer}>
              <Animated.Image
                source={{
                  uri: `${apiImages}${empresa.image}`,
                }}
                style={styles.image}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.editIcon}
                onPress={handleImagePicker}
              >
                <Ionicons name="pencil" size={26} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.circle}>
              <Text style={styles.initial}>
                {empresa?.nomeEmpresa.charAt(0).toUpperCase()}
              </Text>
              <TouchableOpacity
                style={styles.editIcon}
                onPress={handleImagePicker}
              >
                <Ionicons name="pencil-outline" size={26} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Campos do formulário */}
        <View style={{ width: "100%" }}>
          {/* input com o nome da empresa */}
          <ThemedText style={styles.label}>Nome da Empresa</ThemedText>
          <Controller
            control={control}
            name="nomeEmpresa"
            rules={{
              minLength: {
                value: 3,
                message: "O nome deve ter pelo menos 3 caracteres",
              },
              required: "O nome da empresa é obrigatório",
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedInput
                value={value}
                type="outlined"
                placeholder="Digite o nome da empresa"
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="words"
                errorMessage={errors.nomeEmpresa?.message}
              />
            )}
          />
          {/* input com a descriçao da empresa */}
          <ThemedText style={styles.label}>Descrição da Empresa</ThemedText>
          <Controller
            control={control}
            name="description"
            rules={{
              required: "A descrição é obrigatória desde a primeira alteração de dados.",
              maxLength:{
                value:500,
                message:"O número máximo de caracteres para descrição e de 500!"
              },
              minLength:{
                value: 10,
                message:"O número mínimo de caracteres para descrição e de 10!"
              }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedInput
                value={value}
                type="big"
                placeholder="Digite uma descrição"
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
                textAlignVertical="top"
                errorMessage={errors.description?.message}
              />
            )}
          />

          {/* input com a telefone da empresa */}
          <ThemedText style={styles.label}>Telefone da Empresa</ThemedText>
          <Controller
            control={control}
            name="phoneNumber"
            rules={{
              required: "O número de telefone é obrigatório desde a primeira alteração de dados.",
              minLength: {
                value: 10,
                message: "O número deve ter no mínimo 10 dígitos",
              },
              maxLength: {
                value: 15,
                message: "O número deve ter no máximo 15 dígitos",
              },
              pattern: {
                value: /^\+?\d{10,15}$/,
                message: "Número inválido. Apenas números, com opcional '+'.",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedInput
                value={value}
                type="outlined"
                keyboardType="phone-pad"
                placeholder="Número de contato da empresa"
                onChangeText={onChange}
                onBlur={onBlur}
                errorMessage={errors.phoneNumber?.message}
              />
            )}
          />

          {/* input com o endereço da empresa */}
          <ThemedText style={styles.label}>Endereço da empresa</ThemedText>
          <Controller
            control={control}
            name="address"
            rules={{
              required: "O Endereço é obrigatório desde a primeira alteração de dados. ",
              maxLength:{
                value: 100,
                message:"O número máximo de caracteres para o endereço e de 100!"
              },
              minLength:{
                value: 10,
                message:"O número mínimo de caracteres para o endereço e de 10"
              }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedInput
                value={value}
                type="outlined"
                placeholder="Endereço da empresa"
                onChangeText={onChange}
                onBlur={onBlur}
                errorMessage={errors.address?.message}
              />
            )}
          />

          {/* Campos de senha */}
          <ThemedText style={styles.label}>Senha Atual</ThemedText>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedInput
                placeholder="Digite sua senha atual"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                type="outlined"
                isPassword
                errorMessage={errors.password?.message}
              />
            )}
          />
          {/* campo da nova senha */}
          <ThemedText style={styles.label}>Nova Senha</ThemedText>
          <Controller
            control={control}
            name="newPassword"
            rules={{
              minLength: {
                value: 6,
                message: "A senha deve ter pelo menos 6 caracteres",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedInput
                placeholder="Digite sua nova senha"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                type="outlined"
                isPassword
              />
            )}
          />
          {/* campo de confirmaçao da nova senha */}
          <ThemedText style={styles.label}>Confirme sua nova senha</ThemedText>
          <Controller
            control={control}
            name="confirmNewPassword"
            rules={{
              validate: (value) =>
                value === getValues("newPassword") || "As senhas não coincidem",
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedInput
                placeholder="Confirme sua nova senha"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                type="outlined"
                isPassword
                errorMessage={errors.confirmNewPassword?.message}
              />
            )}
          />
        </View>
      </ScrollView>

      {/* Botão para salvar as alterações */}
      <ThemedButton
        title={isSubmitting ? "Salvando..." : "Salvar"}
        onPress={handleSubmit(handleSave)}
        isLoading={isSubmitting}
        disabled={isSubmitting}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  // Estilos do componente
  container: {
    flex: 1,
    padding: 16,
  },
  containerloading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
  },
  label: {
    fontWeight: "bold",
    marginVertical: 8,
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  initial: {
    fontSize: 40,
    color: "#fff",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 20,
  },
});
