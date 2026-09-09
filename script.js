// ==========================================
// COMPOSTA+
// Cadastro e exibição de estabelecimentos
// ==========================================

const formulario = document.getElementById("form-cadastro");
const listaRestaurantes = document.getElementById("lista-restaurantes");
const contadorRestaurantes = document.getElementById("contador-restaurantes");



// ==========================================
// CARREGAR RESTAURANTES SALVOS
// ==========================================

let restaurantesCadastrados =
  JSON.parse(localStorage.getItem("restaurantesComposta")) || [];


// ==========================================
// ATUALIZAR CONTADOR
// ==========================================

function atualizarContador() {

  const quantidade =
    3 + restaurantesCadastrados.length;

  contadorRestaurantes.textContent =
    quantidade === 1
      ? "1 local"
      : `${quantidade} locais`;
}


// ==========================================
// CRIAR CARD DO RESTAURANTE
// ==========================================

function criarCard(restaurante) {

  const card = document.createElement("article");

  card.className = "card";

  card.innerHTML = `
    <div class="card-icone">
      ${obterIcone(restaurante.tipo)}
    </div>

    <div class="card-conteudo">

      <span class="status">
        ● Disponível para coleta
      </span>

      <h3>${escaparHTML(restaurante.nome)}</h3>

      <p class="local">
        📍 ${escaparHTML(restaurante.endereco)}
      </p>

      <div class="residuo">
        <span>Resíduo orgânico</span>
        <strong>${restaurante.residuo} kg</strong>
      </div>

      <button
        class="botao solicitar"
        data-restaurante="${escaparHTML(restaurante.nome)}">

        Solicitar coleta

      </button>

    </div>
  `;

  listaRestaurantes.appendChild(card);
}


// ==========================================
// ESCOLHER ÍCONE
// ==========================================

function obterIcone(tipo) {

  const icones = {
    restaurante: "🍽️",
    pizzaria: "🍕",
    lanchonete: "🍔",
    padaria: "🥖",
    hotel: "🏨",
    outro: "🏪"
  };

  return icones[tipo] || "🏪";
}


// ==========================================
// EVITAR INSERÇÃO DE HTML
// ==========================================

function escaparHTML(texto) {

  const div = document.createElement("div");

  div.textContent = texto;

  return div.innerHTML;
}


// ==========================================
// EXIBIR RESTAURANTES SALVOS
// ==========================================

function carregarRestaurantes() {

  restaurantesCadastrados.forEach(function(restaurante) {

    criarCard(restaurante);

  });

  atualizarContador();
}


// ==========================================
// CADASTRAR NOVO ESTABELECIMENTO
// ==========================================

formulario.addEventListener("submit", function(event) {

  event.preventDefault();


  // Pegar os valores do formulário

  const nome =
    document.getElementById("nome").value.trim();

  const documento =
    document.getElementById("documento").value.trim();

  const email =
    document.getElementById("email").value.trim();

  const tipo =
    document.getElementById("tipo").value;

  const telefone =
    document.getElementById("telefone").value.trim();

  const endereco =
    document.getElementById("endereco").value.trim();

  const residuo =
    document.getElementById("residuo").value;

  const frequencia =
    document.getElementById("frequencia").value;

  const observacoes =
    document.getElementById("observacoes").value.trim();




  // Criar objeto do restaurante

  const novoRestaurante = {

    id: Date.now(),

    nome: nome,

    documento: documento,

    email: email,

    tipo: tipo,

    telefone: telefone,

    endereco: endereco,

    residuo: residuo,

    frequencia: frequencia,

    observacoes: observacoes

  };


  // Adicionar à lista

  restaurantesCadastrados.push(novoRestaurante);


  // Salvar no navegador

  localStorage.setItem(
    "restaurantesComposta",
    JSON.stringify(restaurantesCadastrados)
  );


  // Criar o card imediatamente

  criarCard(novoRestaurante);


  // Atualizar contador

  atualizarContador();


  // Limpar formulário

  formulario.reset();


  // Mensagem de sucesso

  alert(
    `Estabelecimento "${nome}" cadastrado com sucesso!`
  );


  // Voltar para a lista de restaurantes

  document
    .getElementById("restaurantes")
    .scrollIntoView({
      behavior: "smooth"
    });

});


// ==========================================
// BOTÃO "SOLICITAR COLETA"
// ==========================================

document.addEventListener("click", function(event) {

  if (
    event.target.classList.contains("solicitar")
  ) {

    const restaurante =
      event.target.dataset.restaurante;

    alert(
      `Solicitação de coleta para "${restaurante}" registrada!`
    );

  }

});


// ==========================================
// INICIAR SISTEMA
// ==========================================

carregarRestaurantes();