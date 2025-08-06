


const fs = require('fs'); // Módulo para manipulação de arquivos
const readline = require('readline'); // Módulo para ler entrada do usuário no terminal

const ARQUIVO = 'usuarios.json'; // Nome do arquivo onde os usuários serão salvos

// Verifica se o arquivo existe; se não existir, cria um arquivo vazio com um array vazio
if (!fs.existsSync(ARQUIVO)) {
  fs.writeFileSync(ARQUIVO, '[]');
}

// Função para ler os usuários do arquivo JSON
function lerUsuarios() {
  try {
    const data = fs.readFileSync(ARQUIVO, 'utf8'); // Lê arquivo como texto
    return JSON.parse(data); // Converte texto JSON para array de usuários
  } catch {
    return []; // Caso haja erro, retorna array vazio
  }
}

// Função para salvar o array de usuários no arquivo JSON
function salvarUsuarios(usuarios) {
  fs.writeFileSync(ARQUIVO, JSON.stringify(usuarios, null, 2)); // Converte array para JSON formatado e salva
}

// Configuração do readline para entrada e saída padrão (terminal)
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Função que retorna uma Promise para facilitar uso com async/await ao perguntar algo no terminal
function perguntar(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

// Função principal do menu em loop infinito para interação com o usuário
async function menu() {
  while (true) {
    console.log('\n=================================');
    console.log('=== 💻 Sistema de Usuários 💻 ===');
    console.log('=================================\n');

    console.log('1 - Cadastrar usuário');
    console.log('2 - Fazer login');
    console.log('3 - Listar usuários');
    console.log('4 - Deletar usuário');
    console.log('0 - Sair');

    const option = await perguntar('\nEscolha uma opção: ');

    switch (option) {
      case '1':
        await cadastrar(); // Chama função para cadastro
        break;
      case '2':
        await login(); // Chama função para login
        break;
      case '3':
        listarUsuarios(); // Lista todos os usuários
        break;
      case '4':
        await deletarUsuario(); // Deleta um usuário específico
        break;
      case '0':
        console.log('\n👋 Encerrando o programa...');
        rl.close(); // Fecha interface readline
        process.exit(); // Encerra o programa Node.js
      default:
        console.log('\n❌ Opção inválida!');
    }
  }
}

// Função para cadastrar novo usuário
async function cadastrar() {
  const usuarios = lerUsuarios(); // Lê lista atual de usuários

  // Pergunta dados do usuário
  const nomeCompleto = await perguntar('\nNome completo: ');
  const usuario = await perguntar('Nome de usuário: ');

  // Validação básica: nome de usuário não pode estar vazio nem ter espaços
  if (!nomeCompleto || !usuario || usuario.includes(' ')) {
    console.log('\n❌ Erro! Nome completo pode conter espaços mas o nome de usuário não.');
    return;
  }

  // Verifica se nome completo já existe (case insensitive)
  if (usuarios.find(u => u.nomeCompleto.toLowerCase() === nomeCompleto.toLowerCase())) {
    console.log('\n❌ Já existe uma conta com esse Nome completo!');
    return;
  }

  // Verifica se nome de usuário já existe
  if (usuarios.find(u => u.usuario === usuario)) {
    console.log('\n❌ Nome de usuário já existe!');
    return;
  }

  // Validação do sexo, aceita apenas M ou F (case insensitive)
  let sexo;
  while (true) {
    sexo = await perguntar('Sexo (M/F): ');
    if (sexo.toUpperCase() === 'M' || sexo.toUpperCase() === 'F') {
      sexo = sexo.toUpperCase(); // Guarda sexo em maiúsculo
      break;
    }
    console.log('\n❌ Sexo inválido! Digite apenas M ou F.');
  }

  // Validação da idade, aceita somente números inteiros maiores que 9
  let idade;
  while (true) {
    const idadeStr = await perguntar('Idade: ');
    idade = parseInt(idadeStr);
    if (!isNaN(idade) && idade > 9) break;
    console.log('\n❌ Idade inválida! Digite apenas números inteiros maiores que 9.');
  }

  // Adiciona novo usuário ao array e salva no arquivo
  usuarios.push({ nomeCompleto, usuario, sexo, idade });
  salvarUsuarios(usuarios);
  console.log('\n✅ Usuário cadastrado com sucesso!');
}

// Função para login (apenas verifica se o usuário existe)
async function login() {
  const usuarios = lerUsuarios();

  const usuario = await perguntar('Nome de usuário: ');
  const user = usuarios.find(u => u.usuario === usuario);

  if (!user) {
    console.log('\n❌ Usuário não encontrado!');
    return;
  }

  console.log(`\n✅ Login realizado com sucesso! Bem-vindo, ${user.nomeCompleto}!`);
}

// Função para listar todos os usuários cadastrados
function listarUsuarios() {
  const usuarios = lerUsuarios();
  if (usuarios.length === 0) {
    console.log('\nNenhum usuário cadastrado.');
    return;
  }
  console.log('\n===================================');
  console.log('=== ⭐ Usuários cadastrados ⭐ ====');
  console.log('===================================\n');

  usuarios.forEach((u, i) => {
    console.log(`${i + 1}. Nome completo: ${u.nomeCompleto}\n   Nome de usuário: ${u.usuario}\n   Sexo: ${u.sexo} | Idade: ${u.idade}\n`);
  });
}

// Função para deletar um usuário pelo nome de usuário
async function deletarUsuario() {
  const usuarios = lerUsuarios();

  const usuario = await perguntar('\nDigite o nome de usuário que deseja deletar: ');
  const index = usuarios.findIndex(u => u.usuario === usuario);

  if (index === -1) {
    console.log('\n❌ Usuário não encontrado!');
    return;
  }

  usuarios.splice(index, 1); // Remove o usuário do array
  salvarUsuarios(usuarios); // Salva alteração no arquivo
  console.log(`\n✅ Usuário ${usuario} deletado com sucesso!`);
}

// Inicia o menu do sistema
menu();



