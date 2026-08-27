const botoesColeta = document.querySelectorAll('.solicitar');

botoesColeta.forEach((botao) => {
  botao.addEventListener('click', () => {
    const restaurante = botao.dataset.restaurante;
    alert(`Coleta solicitada para ${restaurante}!\n\nEsta ação é apenas uma simulação do protótipo.`);
  });
});
