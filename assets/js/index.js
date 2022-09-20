// DECLARANDO CONSTS

const tipoDeTransacao = document.querySelector('#tipo');
const mercadoria = document.querySelector('#nome');
const valor = document.querySelector('#valor1');
const limpar = document.querySelector('.check2');
const tabela = document.querySelector('.tabela');
const form = document.querySelector('#form');
const input = document.querySelectorAll('.errorInput');
const spans = document.querySelectorAll('.span-required');


// VALIDANDO CAMPOS DO FORMULÁRIO

function setError(index) {
  input[index].style.border = '2px solid #e63636';
  spans[index].style.display = 'block';
  spans[index].style.color = '#e63636';
}

function removeError(index) {
  input[index].style.border = '';
  spans[index].style.display = '';
}

function validacaoForm(event) { // CAMPO DE ERRO PARA NOME INVÁLIDO
  if(input[0].value.length < 3 || input[0].value === "") {
    setError(0);
  } else {
    removeError(0);
  }
  if(input[1].value == ''){
    setError(1);
  } else {
    removeError(1);
  } 
}

// APLICAÇÃO DE MASCARA

function mascaraMoeda(event) {
  const apenasDigitos = event.target.value
    .split("")
    .filter(s => /\d/.test(s))
    .join("")
    .padStart(3, "0")
  const digitoFloat = apenasDigitos.slice(0, -2) + "." + apenasDigitos.slice(-2);
  event.target.value = mascaraCurrency(digitoFloat);
}

function mascaraCurrency(valor, locale = 'pt-BR', currency = 'BRL') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(valor)
}
  

// PREPARANDO O LOCALSTORAGE

function salvarDados(dados) { // CRIANDO ITEM NO LOCAL STORAGE
  localStorage.setItem('produtos', JSON.stringify(dados))
}

// TRAZENDO A LOCALSTORAGE

function buscarDados() { 
  var dados = localStorage.getItem('produtos');
  if (dados !== null) {
    return JSON.parse(dados)
  } else {
    return []
  }
}

// ADICIONANDO ITEM AO LOCAL STORAGE E A TELA

function adicionarProduto() {
  var dados = buscarDados();
  var item = {
    tipo: tipoDeTransacao.value,
    produto: mercadoria.value,
    preco: parseFloat(valor.value.replaceAll('.', '').replace(',', '.').replace('R$', ''))
  }
  if (item.tipo && item.produto && item.preco){ // SE AS CONDIÇÕES NAO FOREM VERDADEIRAS, INVALIDA O FORMULÁRIO
    if (item.produto.value = "" || item.produto.length < 3) {
      return false
    }
    if (item.preco.value <= 0) {
      return false
    }
  dados.push(item);
  salvarDados(dados);
  form.reset();
  }
}

// ADICIONANDO FUNÇÃO AO BOTÃO PARA RESET E SALVAR NO LOCAL STORAGE

form.addEventListener('submit', (event) => {
  event.preventDefault();
  adicionarProduto(); // ADICIONA O PRODUTO NA LOCAL STORAGE
  renderizarDados(); // TRAZ OS DADOS DA LOCAL STORAGE A TELA
});

// DANDO FUNÇÃO A OPÇÃO LIMPAR DADOS

limpar.addEventListener('click', limparDados)

function limparDados() { // LIMPA O LOCALSTORAGE SALVO E RESETA A PÁGINA
  var apagar = window.confirm(`Esses dados serão permanentemente apagados. Deseja Continuar?`);
  if(apagar == true){
    localStorage.clear() 
    location.reload()
  } else {
    return false;
  }
}


// FUNÇÃO PARA TRAZER DADOS DO LOCAL STORAGE DIRETO PARA A TELA

function renderizarDados() {
  var dados = buscarDados();
  tabela.innerHTML = `
  <tr>
      <th></th>
      <th class="mercadoria">Mercadoria</th>
      <th class="valorTabela">Valor</th>
  </tr>
  <tr>
      <td colspan="3" style="height: 1px"></td>
  </tr>   
  `

  var total = 0;


  dados.forEach(item => {
    item.tipo === 'Compra' ? total -= item.preco : total += item.preco;
    tabela.innerHTML += `<tr>  
        <td class="mais">${item.tipo === 'Compra' ? '-' : '+'}</td>
        <td class="texto">${item.produto}</td>
        <td class="valorTabela">${item.preco.toLocaleString('pt-BR', {style: 'currency', currency: "BRL"})}
        </td>
      </tr>  
    `
  });

  
  const resultado = document.querySelector('.valor b');
  resultado.innerHTML = `${total.toLocaleString('pt-BR', {style: 'currency', currency: "BRL"})}` // TRANSFORMA O VALOR JÁ PARA VALOR MONETÁRIO
  const lucro = document.querySelector('.lucro');
  lucro.innerHTML = `${lucroOuPrejuizo(total)}`
}


// FUNÇÃO PARA TRAZER O RESULTADO E DECLARAR PREJUÍZO OU LUCRO

function lucroOuPrejuizo(valor) {
  if (valor < 0) {
    return "[PREJUÍZO]"
  } else if (valor > 0) {
    return "[LUCRO]"
  } else {
    return ''
  }
}