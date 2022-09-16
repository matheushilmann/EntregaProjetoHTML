// DECLARANDO CONSTS

const tipoDeTransacao = document.querySelector('#tipo');
const mercadoria = document.querySelector('#nome');
const valor = document.querySelector('#valor1');
const limpar = document.querySelector('.check2');
const tabela = document.querySelector('.tabela');
const form = document.querySelector('#form');

// PREPARANDO O LOCALSTORAGE

function salvarDados(dados) {
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

// ADICIONANDO ITEM AO LOCAL STORAGE

function adicionarProduto() {
  const dados = buscarDados();
  const item = {
    tipo: tipoDeTransacao.value,
    produto: mercadoria.value,
    preco: Number(valor.value)
  }

  dados.push(item)
  salvarDados(dados)
}

// ADICIONANDO FUNÇÃO AO BOTÃO PARA RESET E SALVAR NO LOCAL STORAGE

form.addEventListener('submit', (event) => {
  event.preventDefault();
  adicionarProduto();
  form.reset(); 
  renderizarDados();


// ADICIONANDO MASCARA NO CAMPO VALOR E MERCADORIA

  // const valor = document.querySelector('#valor1')

  // if(valor.value == '') {
  //   valor.classList.add("errorInput")
  // } else if(!isNaN(valor.value) == true) {
  //   valor.classList.remove("errorInput")
  // }

  // if(mercadoria.value == '') {
  //   valor.classList.add("errorInput")
  // }
});

// DANDO FUNÇÃO A OPÇÃO LIMPAR DADOS

limpar.addEventListener('click', limparDados)

function limparDados() {
  localStorage.clear()
}

// FUNÇÃO DO CONSOLE PARA TRAZER DADOS A TELA DO LOCALSTORAGE

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
  resultado.innerHTML = `${total.toLocaleString('pt-BR', {style: 'currency', currency: "BRL"})}`
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