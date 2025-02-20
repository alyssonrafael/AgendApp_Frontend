import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/src/services/api";

interface User {
  name: string;
  email: string;
  createdAt: string;
}

// Interface que define o formato do contexto do usuário
interface UserContextType {
  user: User | null;                         // Dados do usuário ou null se não estiver logado
  loading: boolean;                          // Indica se os dados do usuário estão carregando
  fetchUserData: () => Promise<void>;         // Função para buscar os dados do usuário
  updateUserName: (name: string) => Promise<boolean>; // Função para atualizar o nome do usuário
  updateUserPassword: (password: string, newPassword: string) => Promise<boolean>; // Função para atualizar a senha do usuário
}

// Criação do contexto do usuário
const UserContext = createContext<UserContextType | undefined>(undefined);

// Componente que provê o contexto do usuário para os componentes filhos
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Função para buscar as informações do usuário
  const fetchUserData = async () => {
    try {
      setLoading(true);  
      // Obtém o token de autenticação do AsyncStorage
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        setUser(null);
        return;
      }
      // Faz a requisição para obter os dados do usuário
      const response = await api.get("/userPerfil", {
        headers: { Authorization: `${token}` },
      });
      // Armazena os dados do usuário no estado
      setUser(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      setUser(null);  // Define usuário como null em caso de erro
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar o nome do usuário
  const updateUserName = async (name: string): Promise<boolean> => {
    // Se não  existir usuário retorna false
    if (!user) return false;
    try {
      // Obtém o token de autenticação do AsyncStorage
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return false;
      // Faz a requisição para atualizar o nome do usuário
      await api.put(
        "/update/user",
        { name },
        { headers: { Authorization: `${token}` } }
      );
      // Atualiza o nome do usuário no estado
      setUser((prev) => (prev ? { ...prev, name } : null));
      return true;  // Retorna true indicando sucesso
    } catch (error) {
      console.error("Erro ao atualizar nome:", error);
      return false;
    }
  };

  // Função para atualizar a senha do usuário
  const updateUserPassword = async (password: string, newPassword: string): Promise<boolean> => {
    // Se não  existir usuário retorna false
    if (!user) return false;
    try {
      // Obtém o token de autenticação do AsyncStorage
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return false;
      // Faz a requisição para atualizar a senha do usuário
      await api.put(
        "/update/user",
        { password, newPassword },
        { headers: { Authorization: `${token}` } }
      );
      return true;  // Retorna true indicando sucesso
    } catch (error: any) {
      // Verifica se o erro é devido à senha atual incorreta
      if (error.response?.status === 401) {
        //lança o erro para que seja possivel exxibir na mensagem no componente que utilizar
        throw new Error("Senha atual incorreta."); 
      } else {
        throw new Error("Erro ao atualizar senha.");
      }
    }
  };

  // useEffect para buscar os dados do usuário ao carregar o componente
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    // Prove o contexto para os componentes filhos
    <UserContext.Provider value={{ user, loading, fetchUserData, updateUserName, updateUserPassword }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personalizado para acessar o contexto do usuário
export const useUser = () => {
  const context = useContext(UserContext);
  // Verifica se o hook está sendo usado dentro de um UserProvider
  if (!context) {
    //lança um erro caso não esteja
    throw new Error("useUser deve ser usado dentro de um UserProvider");
  }
  return context;
};
