const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt'); // Importe a biblioteca bcrypt

// Configuração do banco de dados
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'login',
  password: '070506', 
  port: 5432,
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Rota para a raiz (/)
app.get('/', (req, res) => {
  console.log('Requisição recebida na rota /');
  res.send('Bem-vindo ao servidor do IFCE Jaguaruana!'); // Ou redirecione para outra página
});

// Função para validar o email
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Função para validar a senha (pode ser mais rigorosa)
function validatePassword(password) {
  return password.length >= 8; // Verifica se a senha tem pelo menos 8 caracteres
}

// Rota para cadastro de usuário
app.post('/signup', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    console.log('Recebendo dados de cadastro:', { nome, email, senha }); // Log dos dados recebidos

    // Validar os dados
    if (!validateEmail(email)) {
      console.log('Email inválido:', email);
      return res.status(400).json({ success: false, message: 'Email inválido.' });
    }

    if (!validatePassword(senha)) {
      console.log('Senha inválida:', senha);
      return res.status(400).json({ success: false, message: 'Senha inválida. A senha deve ter pelo menos 8 caracteres.' });
    }

    // Verificar se o e-mail já existe
    const emailExistente = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    console.log('Resultado da verificação de e-mail:', emailExistente.rows); // Log do resultado da verificação

    if (emailExistente.rows.length > 0) {
      console.log('O email já está em uso:', email);
      return res.status(409).json({ success: false, message: 'O email já está em uso.' });
    }

    // Criptografar a senha
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    console.log('Senha criptografada gerada:', senhaCriptografada);

    // Inserir o novo usuário
    const result = await pool.query(
      'INSERT INTO users (nome, email, senha) VALUES ($1, $2, $3) RETURNING *',
      [nome, email, senhaCriptografada]
    );
    console.log('Usuário cadastrado com sucesso:', result.rows[0]);

    res.json({ success: true, message: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).json({ success: false, message: 'Erro ao cadastrar usuário.' });
  }
});

// Rota para login
app.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    console.log('Recebendo dados de login:', { email, senha }); // Log dos dados recebidos

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    console.log('Resultado da busca de e-mail:', result.rows); // Log do resultado da busca

    if (result.rows.length === 0) {
      console.log('Email não encontrado:', email);
      return res.status(401).json({ success: false, message: 'Email não encontrado.' });
    }

    const user = result.rows[0];

    // Verificar a senha
    const senhaValida = await bcrypt.compare(senha, user.senha);
    console.log('Resultado da verificação da senha:', senhaValida); // Log da verificação de senha

    if (!senhaValida) {
      console.log('Senha incorreta para o e-mail:', email);
      return res.status(401).json({ success: false, message: 'Senha incorreta.' });
    }

    console.log('Login realizado com sucesso para o usuário:', user.id);
    res.json({ success: true, message: 'Login realizado com sucesso!', userId: user.id });
  } catch (error) {
    console.error('Erro ao efetuar login:', error);
    res.status(500).json({ success: false, message: 'Erro ao efetuar login.' });
  }
});

app.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});