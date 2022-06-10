//Buscando a chave 'extratoTransacao' no Local Storage.
var extratoTransacaoRaw = localStorage.getItem('extratoTransacao');
if (extratoTransacaoRaw != null) {
    var extratoTransacao = JSON.parse(extratoTransacaoRaw)
} else {
    var extratoTransacao = []
}

//Calculo dos valores totais de compra e venda
var total = 0
var compra = []
var compraTotal = 0
var venda = []
var vendaTotal = 0

for (conteudoItem of extratoTransacao) {
    if (conteudoItem.operador === 'compra') {
        compra = conteudoItem.valor.replace(/\./g , '').replace(',' , '.')
        compraTotal += Number.parseFloat(compra)
    }

    if (conteudoItem.operador === 'venda') {
        venda = conteudoItem.valor.replace(/\./g , '').replace(',' , '.')
        vendaTotal += Number.parseFloat(venda)
    }
}

total = Number.parseFloat(vendaTotal - compraTotal).toLocaleString('pt-BR')

//Variavel do SPAN de lucro ou prejuízo
lucroPrejuizo = ''
    if (parseFloat(total) > 0) {
        lucroPrejuizo = '[LUCRO]'
    }

    if (parseFloat(total) < 0) {
        lucroPrejuizo = '[PREJUÍZO]'
    }

//Função para desenhar a tabela em Extrato de Transações
function desenhaExtrato() {
    //Permite que os dados sejam deletados no Limpar Dados
    linhasExistentes = [...document.querySelectorAll('.tabela-dinamica')];
    linhasExistentes.forEach((element) => {
        element.remove()
    })

    //Loop para desenhar o que for adicionado da função testaFormulario
    for (conteudoItem in extratoTransacao) {
        document.querySelector('div.tabela').innerHTML += 
        `<div class="tabela-conteudo tabela-dinamica">
            <div class="tabela-conteudo-operador">${(extratoTransacao[conteudoItem].operador == 'venda' ? '+' : '-')}</div>
            <div class="tabela-conteudo-mercadoria">${extratoTransacao[conteudoItem].mercadoria}</div>
            <div class="tabela-conteudo-valor">R$ ${extratoTransacao[conteudoItem].valor}</div>
        </div>`
    }
}

//Função para desenhar o total em Extrato de Transações
function desenhaExtratoTotal() {
    //Div com conteúdo do total do extrato de transação
    document.querySelector('div.tabela').innerHTML +=
    `<div class="tabela-conteudo-total">
        <div class="tabela-conteudo-operador">&nbsp;</div>
        <div class="tabela-conteudo-mercadoria">Total</div>
        <div class="tabela-conteudo-valor-total">R$ ${total}<span>${lucroPrejuizo}</span></div>
    </div>`
}

//Função para limpar toda a tabela e persiste no local storage
function limparDados() {
    if (window.confirm("Deseja limpar todo o extrato de transações?")) {
        extratoTransacao.splice(0, extratoTransacao.length); 
        localStorage.setItem('extratoTransacao' , JSON.stringify(extratoTransacao));
        desenhaExtrato();
        location.reload();
    }
}

//Função para adicionar itens
function testaFormulario(e) {
    e.preventDefault(); //Previne que o form submeta para o action e execute o que está abaixo.

    //Primeiro irá mostrar a lista salva no local storage.
    var extratoTransacaoRaw = localStorage.getItem('extratoTransacao');
        if (extratoTransacaoRaw != null) {
            var extratoTransacao = JSON.parse(extratoTransacaoRaw)
        } else {
            var extratoTransacao = []
        }

    //Adiciona um elemento novo em Extrato de Transação, precisa ser um objeto e conter as propriedades do objeto principal. O "e" é evento que se refere ao Evento Submit. Para adicionar as informações lá dentro terá que coletar dentro do Evento Submit, nele possuí um target e elementos dentro do target. Depois é possível coletar por índice, no caso: transacao, mercadoria e valor. Por fim, o .value ao final é para coletar o que foi digitado dentro do input daquele indice.
    extratoTransacao.push({
        operador: e.target.elements['transacao'].value,
        mercadoria: e.target.elements['mercadoria'].value,
        valor: e.target.elements['valor'].value
    })

    //Faz persistir o item adicionado através do formulario. Primeiro vem a chave entre '' e depois a variavel 
    localStorage.setItem('extratoTransacao' , JSON.stringify(extratoTransacao))

    //Faz redirecionar para a mesma página em que está.
    document.getElementById('paginainicial').click()
}

//Função para que o valor fique em R$
function testaCampoValor(e) {
    var valor = e.value.replace(/\D/g,'');
	valor = (valor/100).toFixed(2) + '';
	valor = valor.replace(".", ",");
	valor = valor.replace(/(\d)(\d{3})(\d{3})(\d{3}),/g, "$1.$2.$3.$4,");
	valor = valor.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
	valor = valor.replace(/(\d)(\d{3}),/g, "$1.$2,");
	e.value = valor;
}

//Ações
desenhaExtrato();
if (extratoTransacao.length === 0) {
    document.querySelector('div.tabela').innerHTML +=
    `<div class="tabela-conteudo tabela-dinamica">
        <div class="tabela-conteudo-operador"></div>
        <div class="tabela-conteudo-mercadoria">Nenhuma transação cadastrada!</div>
        <div class="tabela-conteudo-valor"></div>
    </div>`
}
desenhaExtratoTotal();

