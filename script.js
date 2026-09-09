// Composta+ - cadastro e exibição dos estabelecimentos

const formulario = document.getElementById("form-cadastro");
const listaRestaurantes = document.getElementById("lista-restaurantes");
const contadorRestaurantes = document.getElementById("contador-restaurantes");

let restaurantesCadastrados =
  JSON.parse(localStorage.getItem("restaurantesComposta")) || [];

function atualizarContador() {
  const quantidade = 3 + restaurantesCadastrados.length;
  contadorRestaurantes.textContent = `${quantidade} locais`;
}

function obterIcone(tipo) {
  const icones = {
    restaurante: "🍽️",
    pizzaria: "🍕",
    lanchonete: "🍔",
    padaria: "🥖",
    "bistrô": "🥗",
    hotel: "🏨",
    outro: "🏪"
  };

  const tipoNormalizado = tipo.toLowerCase();
  return icones[tipoNormalizado] || "🏪";
}

function escaparHTML(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

function criarCard(restaurante) {
  const card = document.createElement("article");
  card.className = "card";

  card.innerHTML = `
    <div class="card-icone">${obterIcone(restaurante.tipo)}</div>

    <div class="card-conteudo">
      <span class="status">● Disponível para coleta</span>
      <h3>${escaparHTML(restaurante.nome)}</h3>
      <p class="local">📍 ${escaparHTML(restaurante.endereco)}</p>

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

function carregarRestaurantes() {
  restaurantesCadastrados.forEach(function(restaurante) {
    criarCard(restaurante);
  });

  atualizarContador();
}

formulario.addEventListener("submit", function(event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const tipo = document.getElementById("tipo").value;
  const telefone = document.getElementById("telefone").value.trim();
  const endereco = document.getElementById("endereco").value.trim();
  const residuo = document.getElementById("residuo").value;
  const frequencia = document.getElementById("frequencia").value;
  const observacoes = document.getElementById("observacoes").value.trim();

  const novoRestaurante = {
    id: Date.now(),
    nome,
    email,
    tipo,
    telefone,
    endereco,
    residuo,
    frequencia,
    observacoes
  };

  restaurantesCadastrados.push(novoRestaurante);

  localStorage.setItem(
    "restaurantesComposta",
    JSON.stringify(restaurantesCadastrados)
  );

  criarCard(novoRestaurante);
  atualizarContador();
  formulario.reset();

  alert(`Estabelecimento "${nome}" cadastrado com sucesso!`);

  document.getElementById("restaurantes").scrollIntoView({
    behavior: "smooth"
  });
});

document.addEventListener("click", function(event) {
  if (event.target.classList.contains("solicitar")) {
    const restaurante = event.target.dataset.restaurante;
    alert(`Solicitação de coleta para "${restaurante}" registrada!`);
  }
});

carregarRestaurantes();
