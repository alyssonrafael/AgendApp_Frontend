# 💻 Front-end – [AgendApp]

Este repositório contém a interface mobile do **Projeto AgendApp** , um aplicativo focado no agendamento e na disponibilização de serviços para o público em geral. A proposta é oferecer uma **experiência simples mas completa, limpa e intuitiva** , facilitando a conexão entre clientes e prestadores de serviço.

O projeto teve início como um **trabalho acadêmico** , mas ao longo do desenvolvimento, meu interesse pela área de desenvolvimento mobile cresceu significativamente. Com isso, decidi transformar o AgendApp no início de um **produto real e viável** , com potencial para evoluir.

---

### 🚀 Tecnologias Utilizadas

[![My Skills](https://skillicons.dev/icons?i=react,typescript,figma,reactnative,expo)](https://skillicons.dev)

- **React Native**: Desenvolvimento mobile com foco em apps nativos para iOS e Android.
- **TypeScript**: Superset de JavaScript que adiciona tipagem estática ao código.
- **Figma**: Ferramenta de design para prototipação e desenvolvimento de interfaces.
- **Expo**: Framework e plataforma para o desenvolvimento de aplicações React Native.
- **Context API**: Gestão de estado global em aplicativos React e React Native de forma eficiente.
- **Temas Personalizados**: Implementação de temas (claro, escuro ou seguir o sistema) e estilos dinâmicos utilizando `StyleSheet` no React Native.
- **Expo Route**: Navegação do Expo

---

## ⚙️ Como Rodar o Projeto Localmente

Antes de iniciar, **certifique-se de que o back-end está rodando corretamente e acessível**.
👉 Você pode ver mais detalhes sobre como configurar o back-end [neste link](https://github.com/alyssonrafael/AgendApp_Backend).

### 1. Clonar o repositório

```bash
git clone https://github.com/alyssonrafael/AgendApp_Frontend
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Instale o ExpoGo para rodar localmente o App

Vá até a loja de aplicativos do seu celular (Google Play ou App Store) e instale o Expo Go.

Certifique-se de que a versão do Expo Go no seu dispositivo é compatível com o SDK do projeto.

Se a versão do seu Expo Go não for compatível, tente atualizar o aplicativo diretamente na loja ou baixe uma versão compatível com o SDK do projeto.

### 4. Configurar a base URL no arquivo src/sevice/api.ts

Para garantir que o Expo Go consiga se conectar ao seu servidor local, você precisa alterar a URL base nas configurações da API. O Expo Go não consegue acessar localhost, então é necessário usar o IP da sua máquina.

Abra o terminal do seu computador e execute o comando:
Windows: ipconfig
macOS/Linux: ifconfig
Localize o Endereço IPv4 (ou o IP da sua rede local).

No arquivo src/service/api.ts, substitua o 1.1.1.1 pelo IP da sua máquina nas URLs de API. abaixo são as urls que voce devea alterar

```bash
baseURL: "http://1.1.1.1:3333/api",
apiImages: "http://1.1.1.1:3333/uploads/"
```

Isso garante que as requisições sejam enviadas para a API corretamente.

### 5. Rodar o pojeto

Após realizar todas as configurações, você pode executar o aplicativo com o seguinte comando:

```bash
npx expo start
```

Esse comando iniciará o servidor de desenvolvimento do Expo, gerando um QR Code no terminal.
Use o aplicativo Expo Go no seu celular para escanear o código e visualizar o app rodando no dispositivo.

## 🔐 Autenticação

A aplicação possui os seguintes recursos de autenticação:

Cadastro de Clientes e Empresas: Permite o registro de clientes e empresas, com dados básicos e necessários para autenticação.

Recuperação de Senha (Esqueci minha Senha): Funcionalidade de recuperação de senha tanto para clientes quanto para empresas, com envio de e-mail para redefinição de senha.

Login com Google: A aplicação oferece a opção de login com o Google. No entanto, essa funcionalidade está desativada no momento devido a uma limitação do OAuth 2.0, que não aceita callbacks em URLs locais. Isso impede que o login com Google funcione em ambientes de desenvolvimento local, mas está preparado para ser ativado em ambientes de produção.

## 📁 Estrutura Principal do Projeto

- 📦 **src/** – Diretório principal da aplicação

  - 📁 `app/` – Contém todas as telas da aplicação organizadas por rotas
    - 📁 `(auth)/` – Telas compartilhadas de autenticação (login, cadastro, etc.)
    - 📁 `(auth empresas)/` – Telas específicas de autenticação para empresas
    - 📁 `(telasempresas)/` – Telas acessadas exclusivamente por empresas
    - 📁 `(auth users)/` – Telas específicas de autenticação para usuários (clientes)
    - 📁 `(telasusers)/` – Telas acessadas exclusivamente por usuários
    - 📄 `_layout.tsx` – Define a estrutura de layout e navegação principal do app
    - 📄 `+not-found.tsx` – Tela de erro exibida quando uma rota não é encontrada
    - 📄 `index.tsx` – Tela inicial da aplicação (boas vindas no pimeiro acesso)

  - 📁 `assets/` – Arquivos estáticos como imagens, ícones e fontes
  - 📁 `components/` – Componentes reutilizáveis da interface (ex: botões, modais)
  - 📁 `constants/` – Constantes globais como cores, textos e URLs
  - 📁 `context/` – Contextos globais React (ex: autenticação, tema)
  - 📁 `hook/` – Hooks personalizados utilizados ao longo do projeto
  - 📁 `service/api/` – Configuração da API e funções para requisições HTTP

## 🖼️ Imagens do Projeto

<div align="center">
  <img src="./src/assets/imagesDoPojeto/home agendapp.jpg" alt="Tela 1" width="30%" />
  <img src="./src/assets/imagesDoPojeto/home agendapp 1.jpg" alt="Tela 2" width="30%" />
  <img src="./src/assets/imagesDoPojeto/home agendapp 2.jpg" alt="Tela 3" width="30%" />
</div>

> As imagens acima representam a tela de login e as duas telas de home da aplicação.  
👉 Você pode ver mais imagens [neste link](./src/assets/imagesDoPojeto/AgendApp.pdf) ele é um PDF com algumas (não todas) as imagens do app, e apenas no tema claro.


## 🧠 Resumo de Aprendizado

Este projeto me proporcionou um grande avanço no desenvolvimento front-end, especialmente no que diz respeito à construção de interfaces funcionais e intuitivas para gestão de agendamentos e serviços.

Aprendi a:

- Criar interfaces responsivas e agradáveis ao usuário;
- Trabalhar com estados e navegação entre telas de forma fluida;
- Integrar o front-end com APIs de forma eficiente;
- Utilizar boas práticas na organização de componentes e reuso de código;
- Entender melhor a importância da experiência do usuário (UX) no uso diário da aplicação.

A experiência também me permitiu lidar com desafios reais, como ajustes de layout, tratamento de erros e testes manuais de usabilidade. Isso fortaleceu minha confiança no desenvolvimento de aplicações modernas com foco em performance, clareza e usabilidade.
