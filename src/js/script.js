// Selecionar os botões
const btnSignin = document.querySelector("#signin");
const btnSignup = document.querySelector("#signup");
const body = document.querySelector("body");

// Selecionar os formulários
const signupForm = document.querySelector('.first-content .form');
const signinForm = document.querySelector('.second-content .form');

// Função para lidar com o envio do formulário de cadastro
signupForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Impede o comportamento padrão do formulário

  // Obter os dados do formulário
  const nome = signupForm.querySelector('input[type="text"]').value;
  const email = signupForm.querySelector('input[type="email"]').value;
  const senha = signupForm.querySelector('input[type="password"]').value;

  // Fazer a requisição para o backend usando fetch
  fetch('http://localhost:3000/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nome: nome,
      email: email,
      senha: senha
    })
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Erro ao cadastrar usuário.');
    }
  })
  .then(data => {
    // Lidar com a resposta do backend
    console.log('Resposta do servidor:', data);
    // Redirecionar o usuário para a página de login ou exibir uma mensagem de sucesso
  })
  .catch(error => {
    // Lidar com erros da requisição
    console.error('Erro:', error);
  });
});

// Função para lidar com o envio do formulário de login
signinForm.addEventListener('submit', (event) => {
  event.preventDefault();

  // Obter os dados do formulário
  const email = signinForm.querySelector('input[type="email"]').value;
  const senha = signinForm.querySelector('input[type="password"]').value;

  // Fazer a requisição para o backend usando fetch
  fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      senha: senha
    })
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Erro ao fazer login.');
    }
  })
  .then(data => {
    // Lidar com a resposta do backend
    console.log('Resposta do servidor:', data);
    // Redirecionar o usuário para a página principal ou exibir uma mensagem de sucesso
  })
  .catch(error => {
    // Lidar com erros da requisição
    console.error('Erro:', error);
  });
});

btnSignin.addEventListener("click", function() {
   body.className = "sign-in-js";
});

btnSignup.addEventListener("click", function() {
   body.className = "sign-up-js";
});