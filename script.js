// Composta+ - cadastro, coleta, indicadores e salvamento dos status


// ==============================
// ELEMENTOS DA PÁGINA
// ==============================

const formulario =
  document.getElementById("form-cadastro");

const listaRestaurantes =
  document.getElementById("lista-restaurantes");

const contadorRestaurantes =
  document.getElementById("contador-restaurantes");

const indicadorEstabelecimentos =
  document.getElementById("indicador-estabelecimentos");

const indicadorResiduos =
  document.getElementById("indicador-residuos");

const indicadorCompostagem =
  document.getElementById("indicador-compostagem");


// ==============================
// DADOS SALVOS
// ==============================

let restaurantesCadastrados =
  JSON.parse(
    localStorage.getItem("restaurantesComposta")
  ) || [];

let estadosColeta =
  JSON.parse(
    localStorage.getItem("estadosColetaComposta")
  ) || {};


// ==============================
// CONTADOR
// ==============================

function atualizarContador() {

  const quantidade =
    document.querySelectorAll(
      "#lista-restaurantes .card"
    ).length;

  contadorRestaurantes.textContent =
    `${quantidade} locais`;
}


// ==============================
// ÍCONE
// ==============================

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

  const tipoNormalizado =
    tipo.toLowerCase();

  return (
    icones[tipoNormalizado] ||
    "🏪"
  );
}


// ==============================
// PROTEÇÃO DO TEXTO
// ==============================

function escaparHTML(texto) {

  const div =
    document.createElement("div");

  div.textContent =
    texto;

  return div.innerHTML;
}


// ==============================
// SALVA O ESTADO
// ==============================

function salvarEstado(card) {

  const chave =
    card.dataset.chave;

  estadosColeta[chave] = {

    status:
      card.dataset.status || "disponivel",

    quantidadeOriginal:
      Number(
        card.dataset.quantidadeOriginal || 0
      ),

    quantidadeDisponivel:
      Number(
        card.dataset.quantidadeDisponivel || 0
      ),

    quantidadeColeta:
      Number(
        card.dataset.quantidadeColeta || 0
      ),

    quantidadeCompostada:
      Number(
        card.dataset.quantidadeCompostada || 0
      )

  };


  localStorage.setItem(
    "estadosColetaComposta",
    JSON.stringify(estadosColeta)
  );
}


// ==============================
// APLICA ESTADO SALVO
// ==============================

function aplicarEstadoSalvo(card) {

  const chave =
    card.dataset.chave;

  const estado =
    estadosColeta[chave];


  if (!estado) {
    return;
  }


  card.dataset.status =
    estado.status || "disponivel";

  card.dataset.quantidadeOriginal =
    Number(
      estado.quantidadeOriginal ||
      card.dataset.quantidadeOriginal ||
      0
    );

  card.dataset.quantidadeDisponivel =
    Number(
      estado.quantidadeDisponivel ||
      0
    );

  card.dataset.quantidadeColeta =
    Number(
      estado.quantidadeColeta ||
      0
    );

  card.dataset.quantidadeCompostada =
    Number(
      estado.quantidadeCompostada ||
      0
    );


  const status =
    card.querySelector(".status");

  const botao =
    card.querySelector(".solicitar");

  const quantidade =
    card.querySelector(
      ".residuo strong"
    );


  quantidade.textContent =
    `${card.dataset.quantidadeDisponivel} kg`;


  // ==========================
  // COLETA SOLICITADA
  // ==========================

  if (
    card.dataset.status === "solicitada"
  ) {

    status.textContent =
      "● Coleta solicitada";

    botao.textContent =
      "Marcar como coletado";

    botao.disabled =
      false;

  }


  // ==========================
  // COLETADO
  // ==========================

  else if (
    card.dataset.status === "coletado"
  ) {

    status.textContent =
      "● Coletado";

    botao.textContent =
      "Encaminhar para compostagem";

    botao.disabled =
      false;

  }


  // ==========================
  // EM COMPOSTAGEM
  // ==========================

  else if (
    card.dataset.status === "compostagem"
  ) {

    status.textContent =
      "● Em compostagem";


    if (
      Number(
        card.dataset.quantidadeDisponivel
      ) > 0
    ) {

      botao.textContent =
        "Solicitar nova coleta";

      botao.disabled =
        false;

    } else {

      botao.textContent =
        "Sem resíduos disponíveis";

      botao.disabled =
        true;

    }

  }


  // ==========================
  // SEM RESÍDUOS
  // ==========================

  else if (
    card.dataset.status === "sem_residuo"
  ) {

    status.textContent =
      "● Sem resíduos disponíveis";

    botao.textContent =
      "Sem resíduos disponíveis";

    botao.disabled =
      true;

  }

}


// ==============================
// INDICADORES
// ==============================

function atualizarIndicadores() {

  const cards =
    document.querySelectorAll(
      "#lista-restaurantes .card"
    );


  let totalResiduos = 0;

  let totalCompostagem = 0;


  cards.forEach(function(card) {

    const quantidadeOriginal =
      Number(
        card.dataset.quantidadeOriginal || 0
      );


    const quantidadeCompostada =
      Number(
        card.dataset.quantidadeCompostada || 0
      );


    totalResiduos +=
      quantidadeOriginal;


    totalCompostagem +=
      quantidadeCompostada;

  });


  indicadorEstabelecimentos.textContent =
    cards.length;


  indicadorResiduos.textContent =
    `${totalResiduos} kg`;


  indicadorCompostagem.textContent =
    `${totalCompostagem} kg`;
}


// ==============================
// PREPARA CARDS FIXOS
// ==============================

function prepararCardsIniciais() {

  const cards =
    document.querySelectorAll(
      "#lista-restaurantes .card"
    );


  cards.forEach(function(card) {

    const nome =
      card.querySelector(
        "h3"
      ).textContent.trim();


    const textoResiduo =
      card.querySelector(
        ".residuo strong"
      ).textContent;


    const quantidade =
      Number(
        textoResiduo
          .replace("kg", "")
          .trim()
          .replace(",", ".")
      );


    card.dataset.chave =
      nome;


    card.dataset.status =
      "disponivel";


    card.dataset.quantidadeOriginal =
      quantidade;


    card.dataset.quantidadeDisponivel =
      quantidade;


    card.dataset.quantidadeColeta =
      0;


    card.dataset.quantidadeCompostada =
      0;


    aplicarEstadoSalvo(card);

  });

}


// ==============================
// CRIA CARD DE NOVO ESTABELECIMENTO
// ==============================

function criarCard(restaurante) {

  const card =
    document.createElement("article");


  card.className =
    "card";


  card.dataset.chave =
    restaurante.id;


  card.dataset.status =
    "disponivel";


  card.dataset.quantidadeOriginal =
    Number(
      restaurante.residuo
    );


  card.dataset.quantidadeDisponivel =
    Number(
      restaurante.residuo
    );


  card.dataset.quantidadeColeta =
    0;


  card.dataset.quantidadeCompostada =
    0;


  card.innerHTML = `

    <div class="card-icone">
      ${obterIcone(restaurante.tipo)}
    </div>

    <div class="card-conteudo">

      <span class="status">
        ● Disponível para coleta
      </span>

      <h3>
        ${escaparHTML(restaurante.nome)}
      </h3>

      <p class="local">
        📍 ${escaparHTML(restaurante.endereco)}
      </p>

      <div class="residuo">

        <span>
          Resíduo disponível
        </span>

        <strong>
          ${restaurante.residuo} kg
        </strong>

      </div>

      <button
        class="botao solicitar"
        data-restaurante="${escaparHTML(restaurante.nome)}">

        Solicitar coleta

      </button>

    </div>

  `;


  listaRestaurantes.appendChild(card);


  aplicarEstadoSalvo(card);
}


// ==============================
// CARREGA OS ESTABELECIMENTOS
// ==============================

function carregarRestaurantes() {

  restaurantesCadastrados.forEach(
    function(restaurante) {

      criarCard(restaurante);

    }
  );


  prepararCardsIniciais();

  atualizarContador();

  atualizarIndicadores();
}


// ==============================
// CADASTRO
// ==============================

formulario.addEventListener(
  "submit",
  function(event) {

    event.preventDefault();


    const nome =
      document
        .getElementById("nome")
        .value
        .trim();


    const email =
      document
        .getElementById("email")
        .value
        .trim();


    const tipo =
      document
        .getElementById("tipo")
        .value;


    const telefone =
      document
        .getElementById("telefone")
        .value
        .trim();


    const endereco =
      document
        .getElementById("endereco")
        .value
        .trim();


    const residuo =
      document
        .getElementById("residuo")
        .value;


    const frequencia =
      document
        .getElementById("frequencia")
        .value;


    const observacoes =
      document
        .getElementById("observacoes")
        .value
        .trim();


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


    restaurantesCadastrados.push(
      novoRestaurante
    );


    localStorage.setItem(
      "restaurantesComposta",
      JSON.stringify(
        restaurantesCadastrados
      )
    );


    criarCard(
      novoRestaurante
    );


    atualizarContador();

    atualizarIndicadores();


    formulario.reset();


    alert(
      `Estabelecimento "${nome}" cadastrado com sucesso!`
    );


    document
      .getElementById("restaurantes")
      .scrollIntoView({
        behavior: "smooth"
      });

  }
);


// ==============================
// CONTROLE DA COLETA
// ==============================

document.addEventListener(
  "click",
  function(event) {


    if (
      !event.target.classList.contains(
        "solicitar"
      )
    ) {
      return;
    }


    const restaurante =
      event.target.dataset.restaurante;


    const card =
      event.target.closest(
        ".card"
      );


    const status =
      card.querySelector(
        ".status"
      );


    const textoBotao =
      event.target.textContent.trim();


    // ==========================
    // NOVA COLETA
    // ==========================

    if (
      textoBotao === "Solicitar coleta" ||
      textoBotao === "Solicitar nova coleta"
    ) {


      const quantidadeDisponivel =
        Number(
          card.dataset.quantidadeDisponivel
        );


      if (
        quantidadeDisponivel <= 0
      ) {

        status.textContent =
          "● Sem resíduos disponíveis";

        event.target.textContent =
          "Sem resíduos disponíveis";

        event.target.disabled =
          true;

        return;
      }


      const resposta =
        prompt(
          `Quanto deseja coletar de "${restaurante}"?\n\nQuantidade disponível: ${quantidadeDisponivel} kg`
        );


      if (
        resposta === null
      ) {
        return;
      }


      const quantidadeColeta =
        Number(
          resposta
            .trim()
            .replace(",", ".")
        );


      if (
        isNaN(quantidadeColeta) ||
        quantidadeColeta <= 0 ||
        quantidadeColeta >
          quantidadeDisponivel
      ) {

        alert(
          `Digite uma quantidade entre 1 e ${quantidadeDisponivel} kg.`
        );

        return;
      }


      card.dataset.quantidadeColeta =
        quantidadeColeta;


      card.dataset.status =
        "solicitada";


      status.textContent =
        "● Coleta solicitada";


      event.target.textContent =
        "Marcar como coletado";


      event.target.disabled =
        false;


      salvarEstado(card);


      alert(
        `Solicitação de ${quantidadeColeta} kg para "${restaurante}" registrada!`
      );

    }


    // ==========================
    // MARCAR COMO COLETADO
    // ==========================

    else if (
      textoBotao === "Marcar como coletado"
    ) {


      const quantidadeColeta =
        Number(
          card.dataset.quantidadeColeta
        );


      const quantidadeDisponivel =
        Number(
          card.dataset.quantidadeDisponivel
        );


      const novoTotal =
        quantidadeDisponivel -
        quantidadeColeta;


      card.dataset.quantidadeDisponivel =
        novoTotal;


      card.dataset.status =
        "coletado";


      card.querySelector(
        ".residuo strong"
      ).textContent =
        `${novoTotal} kg`;


      status.textContent =
        "● Coletado";


      event.target.textContent =
        "Encaminhar para compostagem";


      salvarEstado(card);


      alert(
        `Coleta de ${quantidadeColeta} kg de "${restaurante}" realizada!\n\nResíduo restante: ${novoTotal} kg.`
      );

    }


    // ==========================
    // ENCAMINHAR PARA COMPOSTAGEM
    // ==========================

    else if (
      textoBotao === "Encaminhar para compostagem"
    ) {


      const quantidade =
        Number(
          card.dataset.quantidadeColeta
        );


      const quantidadeCompostada =
        Number(
          card.dataset.quantidadeCompostada || 0
        );


      card.dataset.quantidadeCompostada =
        quantidadeCompostada +
        quantidade;


      card.dataset.status =
        "compostagem";


      status.textContent =
        "● Em compostagem";


      if (
        Number(
          card.dataset.quantidadeDisponivel
        ) > 0
      ) {

        event.target.textContent =
          "Solicitar nova coleta";

        event.target.disabled =
          false;

      } else {

        card.dataset.status =
          "sem_residuo";

        status.textContent =
          "● Sem resíduos disponíveis";

        event.target.textContent =
          "Sem resíduos disponíveis";

        event.target.disabled =
          true;

      }


      salvarEstado(card);


      alert(
        `${quantidade} kg de "${restaurante}" encaminhados para compostagem!`
      );

    }


    atualizarIndicadores();

  }
);


// ==============================
// INICIA O SISTEMA
// ==============================

carregarRestaurantes();