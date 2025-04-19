import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import api from "@/src/services/api";  

export interface Empresa {
  nomeEmpresa: string;
  name: string;
  description: string;
  phoneNumber: string;
  address: string;
  image: string;
  email: string;
  createdAt: string;
}
// Interface para o contexto da empresa, descrevendo as funções e variáveis de estado.
interface EmpresaContextType {  
  empresa: Empresa | null;
  loading: boolean;
  fetchEmpresaData: () => Promise<void>;
  updateEmpresaName: (nomeEmpresa: string) => Promise<boolean>;
  updateDescription: (description: string) => Promise<boolean>;
  updatePhoneNumber: (phoneNumber: string) => Promise<boolean>;
  updateAddress: (address: string) => Promise<boolean>;
  updateImage: (image: string) => Promise<boolean>;
  updateEmpresaPassword: (password: string, newPassword: string) => Promise<boolean>;
}
// Criando o contexto da empresa.
const EmpresaContext = createContext<EmpresaContextType | undefined>(undefined);  
// Componente Provider que envolve a aplicação e fornece o contexto.
export const EmpresaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {  
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState(true);

  // Função para buscar os dados da empresa.
  const fetchEmpresaData = async () => {
    try {
      setLoading(true);
      // Obtendo o token de autenticação do AsyncStorage.
      const token = await AsyncStorage.getItem("userToken");  
      if (!token) {
        setEmpresa(null);
        return;
      }
      // Fazendo a requisição para buscar os dados da empresa.
      const response = await api.get("/companyPerfil", {
        headers: { Authorization: `${token}` },
      });
      setEmpresa(response.data);  // Armazenando os dados da empresa no estado.
    } catch (error) {
      console.error("Erro ao buscar empresa:", error);
      setEmpresa(null);  // Em caso de erro, limpa os dados da empresa.
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar o nome da empresa.
  const updateEmpresaName = async (nomeEmpresa: string): Promise<boolean> => {
    // Verifica se a empresa está definida.
    if (!empresa) return false;
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return false;
      // Fazendo a requisição para atualizar o nome da empresa.
      await api.put(
        "/update/company",
        { nomeEmpresa },
        { headers: { Authorization: `${token}` } }
      );
  
      setEmpresa((prev) => (prev ? { ...prev, nomeEmpresa } : null));
      return true;
    } catch (error: any) {
      if (error.response?.status === 409) {
        throw new Error("Nome da empresa já existe."); // Erro específico para nome duplicado
      } else {
        throw new Error("Erro ao atualizar nome da empresa."); // Outros erros
      }
    }
  };
  
  // Função para atualizar a descrição da empresa.
  const updateDescription = async (description: string): Promise<boolean> => {
    if (!empresa) return false;  
    try {
      const token = await AsyncStorage.getItem("userToken");  
      if (!token) return false;
      // Fazendo a requisição para atualizar a descrição da empresa.
      await api.put(
        "/update/company",
        { description },
        { headers: { Authorization: `${token}` } }
      );
      setEmpresa((prev) => (prev ? { ...prev, description } : null));  // Atualiza o estado com a nova descrição.
      return true;
    } catch (error) {
      throw new Error("Erro ao atualizar descrição."); // Erro genérico 
    }
  };
  // Função para atualizar a descrição da empresa.
  const updatePhoneNumber = async (phoneNumber: string): Promise<boolean> => {
    if (!empresa) return false;  
    try {
      const token = await AsyncStorage.getItem("userToken");  
      if (!token) return false;
      // Fazendo a requisição para atualizar o telefone da empresa.
      await api.put(
        "/update/company",
        { phoneNumber },
        { headers: { Authorization: `${token}` } }
      );
      setEmpresa((prev) => (prev ? { ...prev, phoneNumber } : null));  // Atualiza o estado com o novo telefone.
      return true;
    } catch (error) {
      throw new Error("Erro ao atualizar telefone."); // Erro genérico 
    }
  };
  
  // Função para atualizar o endereço da empresa.
  const updateAddress = async (address: string): Promise<boolean> => {
    if (!empresa) return false;  
    try {
      const token = await AsyncStorage.getItem("userToken");  
      if (!token) return false;
      // Fazendo a requisição para atualizar o endereço da empresa.
      await api.put(
        "/update/company",
        { address },
        { headers: { Authorization: `${token}` } }
      );
      setEmpresa((prev) => (prev ? { ...prev, address } : null));  // Atualiza o estado com o novo endereço.
      return true;
    } catch (error) {
      throw new Error("Erro ao atualizar Endereço."); // Erro genérico 
    }
  };

  // Função para atualizar a imagem da empresa.
  const updateImage = async (imageUri: string): Promise<boolean> => {
    if (!empresa) return false;  
    try {
      const token = await AsyncStorage.getItem("userToken");  
      if (!token) return false;  
      // Criando um FormData para enviar a imagem.
      let formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        name: "empresa.jpg",
        type: "image/jpeg",
      } as any); //forçando a ser any para o typescript não dar erro
      // Fazendo a requisição para enviar a imagem.
      await api.post("/company/upload-foto", formData, {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      await fetchEmpresaData();  // Recarrega os dados da empresa após a atualização da imagem.
      return true;
    } catch (error) {
      throw new Error("Erro ao atualizar imagem");  // Lança um erro para que possa ser capturado onde for usado
    }
  };

  // Função para atualizar a senha da empresa.
  const updateEmpresaPassword = async (password: string, newPassword: string): Promise<boolean> => {
    if (!empresa) return false;  
    try {
      const token = await AsyncStorage.getItem("userToken");  
      if (!token) return false;  
      // Fazendo a requisição para atualizar a senha.
      await api.put(
        "/update/company",
        { password, newPassword },
        { headers: { Authorization: `${token}` } }
      );
      return true;  
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error("Senha atual incorreta.");  //  lança erro se a senha atual for incorreta.
      } else {
        throw new Error("Erro ao atualizar senha.");  // Em caso de outros erros.
      }
    }
  };

  useEffect(() => {
    fetchEmpresaData();  // Carrega os dados da empresa quando o componente for montado.
  }, []);

  return (
    <EmpresaContext.Provider value={{
      empresa,  // Fornece os dados da empresa.
      loading,  // Fornece o estado de carregamento.
      fetchEmpresaData,  // Função para buscar os dados da empresa.
      updateEmpresaName,  // Função para atualizar o nome da empresa.
      updateDescription,  // Função para atualizar a descrição da empresa.
      updatePhoneNumber, // Função para atualizar o telefone da empresa.
      updateAddress,  // Função para atualizar o endereço da empresa.
      updateImage,  // Função para atualizar a imagem da empresa.
      updateEmpresaPassword,  // Função para atualizar a senha da empresa.
    }}>
      {children}
    </EmpresaContext.Provider>
  );
};

// Hook personalizado para acessar o contexto da empresa.
export const useEmpresa = () => {
  const context = useContext(EmpresaContext);
  if (!context) {
    // lança erro garantindo que o hook seja usado dentro do provider.
    throw new Error("useEmpresa deve ser usado dentro de um EmpresaProvider");  
  }
  return context;
};
