import axios from "axios";

// Define a base URL global para todas as requisições
const api = axios.create({
  baseURL: "http://10.0.0.20:3333/api", //atualize por seu ip na rede
  timeout: 10000, // Tempo limite da requisição (10s)
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
