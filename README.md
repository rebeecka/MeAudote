
Projeto final do curso de ciência da computação.

Projeto Audote-me:

	- Para executar backend:
		1 - Ter o Nodejs instalado
		2 - Ter o Mongodb instalado e rodando na porta 27017 (porta padrão)
		3 - Entrar no projeto pelo powershell e rodar yarn install (Instala as dependências)
		4 - yarn dev (inicia o projeto)

	- Para executar o aplicativo:
		1 - Ter o Nodejs instalado
		2 - Expo = npm install --global expo-cli
		3 - Entrar no projeto pelo powershell e rodar yarn install (Instala as dependências)
		4 - yarn start (inicia o projeto)
		5 - Abrir o projeto, ir em src/lib/constants.ts e alterar o ip, parar o ip da sua máquina. (Para ver o seu ip, vai no powershell e roda ipconfig e pega o ip que está no ipv4). Obs. Altera apenas o ip, deixa o http:// e a porta.
		5 - Baixa o aplicativo Expo go na play store ou app store
 		6 - Abre o aplicativo e ler o QRCode do powershell, que foi criado quando rodou o yarn start 




Libs utilizadas no app:

Instalar expo:
    - npm install --global expo-cli

Criar projeto:
    - npx create-expo-app --template ou expo init nome_projeto

start:
    - expo start ou yarn start

Navegação - React Navigation -> Navigators:
    - yarn add @react-navigation/native
    - yarn add react-native-screens react-native-safe-area-context
    - yarn add @react-navigation/native-stack

Storage - Salvar dados importantes localmente/offline:
    - yarn add @react-native-async-storage/async-storage

Axios - para requisições http
 -  yarn add axios
