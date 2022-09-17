// DECLARANDO CONSTS

const tipoDeTransacao = document.querySelector('#tipo');
const mercadoria = document.querySelector('#nome');
const valor = document.querySelector('#valor1');
const limpar = document.querySelector('.check2');
const tabela = document.querySelector('.tabela');
const form = document.querySelector('#form');
const input = document.querySelectorAll('.errorInput');
const spans = document.querySelectorAll('.span-required');
const valorRegex = /([0-9]+[\.]*[0-9]*[\,.]*[0-9]*)/;


// VALIDANDO CAMPOS DO FORMULÁRIO

function setError(index) {
  input[index].style.border = '2px solid #e63636';
  spans[index].style.display = 'block';
  spans[index].style.color = '#e63636';
  return false;
}

function removeError(index) {
  input[index].style.border = '';
  spans[index].style.display = '';
}

function validacaoFormNome(event) { // CAMPO DE ERRO PARA NOME INVÁLIDO
  if(input[0].value.length < 3 || input[0].value === "") {
    setError(0);
  } else {
    removeError(0);
  } 
}
function validacaoFormValor(event) { // CAMPO DE ERRO PARA VALOR INVÁLIDO
  if(!valorRegex.test(input[1].value || input[1].value.length > 0)){
    setError(1);
    console.log('letra');
  } else {
    removeError(1);
  } 
}

// APLICAÇÃO DE MASCARA



// PREPARANDO O LOCALSTORAGE

function salvarDados(dados) { // CRIANDO ITEM NO LOCAL STORAGE
  localStorage.setItem('produtos', JSON.stringify(dados))
}

// TRAZENDO A LOCALSTORAGE

function buscarDados() { 
  const dados = localStorage.getItem('produtos');
  if (dados !== null) {
    return JSON.parse(dados)
  } else {
    return []
  }
}

// ADICIONANDO ITEM AO LOCAL STORAGE E A TELA

function adicionarProduto() {
  const dados = buscarDados();
  const item = {
    tipo: tipoDeTransacao.value,
    produto: mercadoria.value,
    preco: Number(valor.value)
  }
  if (item.preco && item.tipo && item.produto){ // SE AS CONDIÇÕES NAO FOREM VERDADEIRAS, INVALIDA O FORMULÁRIO
    dados.push(item);
    salvarDados(dados);
  }
}

// ADICIONANDO FUNÇÃO AO BOTÃO PARA RESET E SALVAR NO LOCAL STORAGE

form.addEventListener('submit', (event) => {
  event.preventDefault();
  validacaoFormNome(event); // CHECA SE O NOME DA MERCADORIA É VALIDO
  validacaoFormValor(event); // CHECA SE O VALOR É VÁLIDO
  adicionarProduto(); // ADICIONA O PRODUTO NA LOCAL STORAGE
  form.reset(); // RESETA OS DADOS DIGITADOS
  renderizarDados(); // TRAZ OS DADOS DA LOCAL STORAGE A TELA
});

// DANDO FUNÇÃO A OPÇÃO LIMPAR DADOS

limpar.addEventListener('click', limparDados)

function limparDados() { // LIMPA O LOCALSTORAGE SALVO E RESETA A PÁGINA
  localStorage.clear() 
}


// FUNÇÃO PARA TRAZER DADOS DO LOCAL STORAGE DIRETO PARA A TELA

function renderizarDados() {
  const dados = buscarDados();
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