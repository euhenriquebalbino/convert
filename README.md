# Convert

Aplicacao web estatica para converter valores de moedas estrangeiras em reais (BRL). O usuario informa um valor, escolhe uma moeda e a tela mostra a cotacao usada junto com o total convertido.

O projeto usa apenas HTML, CSS e JavaScript puro.

## Como executar

Nao existe instalacao de dependencias nem servidor obrigatorio. Para usar o projeto, abra o arquivo `index.html` diretamente no navegador.

Durante o desenvolvimento, voce tambem pode executar com uma extensao como Live Server no VS Code, mas isso e opcional.

## Estrutura do projeto

| Arquivo/Pasta | Funcao |
| --- | --- |
| `index.html` | Define a estrutura da pagina: logo, formulario, campo de valor, seletor de moeda, botao e area de resultado. |
| `style.css` | Controla o visual da aplicacao, incluindo layout, cores, estados de foco, botao, fundo e exibicao do resultado. |
| `main.js` | Contem as cotacoes, captura os elementos da tela, valida o campo de valor, calcula a conversao e atualiza o resultado. |
| `img/` | Guarda os arquivos visuais usados pela pagina: logo, fundo e icone do seletor. |

## Como usar

1. Digite o valor desejado no campo `valor`.
2. Escolha uma moeda no campo `moeda`.
3. Clique em `Converter em reais`.
4. O resultado aparece abaixo do formulario com a cotacao usada e o valor convertido.

Os campos possuem `required`, entao o navegador impede o envio do formulario se o valor ou a moeda nao forem preenchidos.

## Fluxo da aplicacao

```text
Usuario digita no campo de valor
        ↓
main.js remove qualquer caractere que nao seja numero
        ↓
Usuario seleciona a moeda
        ↓
Usuario envia o formulario
        ↓
JavaScript impede o recarregamento da pagina
        ↓
switch verifica qual moeda foi escolhida
        ↓
showResult() calcula, formata e escreve o resultado na tela
        ↓
footer recebe a classe show-result e fica visivel
```

## Funcionamento do HTML

O arquivo `index.html` monta a interface principal da aplicacao.

O formulario possui:

- `input#amount`: campo onde o usuario digita o valor que deseja converter.
- `select#currency`: lista com as moedas disponiveis.
- `button`: envia o formulario e dispara a conversao.

As moedas disponiveis atualmente sao:

| Valor do option | Moeda exibida |
| --- | --- |
| `USD` | Dolar Americano |
| `EUR` | Euro |
| `GBP` | Libra Esterlina |

A area de resultado fica dentro do `footer`:

- `span#description`: mostra a cotacao da moeda selecionada.
- `h1#result`: mostra o valor final convertido em reais.

Mesmo existindo valores iniciais no HTML, o `footer` com o resultado comeca escondido pelo CSS e so aparece depois da primeira conversao.

## Funcionamento do CSS

O arquivo `style.css` define a aparencia da tela:

- centraliza a aplicacao na pagina;
- aplica a imagem de fundo `img/bg.png`;
- estiliza o formulario, inputs, select e botao;
- usa `img/chevron-down.svg` como icone visual do seletor;
- esconde o `footer` inicialmente com `display: none`;
- exibe o resultado quando a classe `.show-result` e adicionada.

A regra mais importante para o fluxo da aplicacao e:

```css
.show-result {
  display: block;
}
```

Ela faz o resultado aparecer depois que o JavaScript adiciona essa classe ao `footer`.

## Funcionamento do JavaScript

O arquivo `main.js` concentra a regra de negocio da conversao.

### Cotacoes

No topo do arquivo existem tres constantes:

```js
const USD = 5.14
const EUR = 6.01
const GBP = 7.01
```

Cada constante representa quantos reais valem uma unidade da moeda.

| Constante | Moeda | Cotacao |
| --- | --- | --- |
| `USD` | Dolar Americano | R$ 5,14 |
| `EUR` | Euro | R$ 6,01 |
| `GBP` | Libra Esterlina | R$ 7,01 |

Essas cotacoes sao fixas. A aplicacao nao busca valores atualizados em uma API.

### Elementos capturados

O script captura os elementos do HTML que serao lidos ou modificados:

```js
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const currency = document.getElementById("currency")
const footer = document.querySelector("main footer")
const description = document.getElementById("description")
const result = document.getElementById("result")
```

Essas variaveis permitem que o JavaScript leia o valor digitado, descubra a moeda escolhida e altere o conteudo exibido na tela.

### Validacao do valor digitado

```js
amount.addEventListener("input", () => {
  const hasCharacterRegex = /\D+/g
  amount.value = amount.value.replace(hasCharacterRegex, "")
})
```

Esse evento roda sempre que o usuario digita no campo `amount`.

A expressao regular `/\D+/g` encontra tudo que nao for digito. Depois, `replace` remove esses caracteres do campo.

Na pratica, o campo aceita apenas numeros inteiros positivos. Letras, espacos, pontos, virgulas e simbolos sao removidos.

### Envio do formulario

```js
form.onsubmit = (event) => {
  event.preventDefault()

  switch (currency.value) {
    case "USD":
      showResult(amount.value, USD, "US$")
      break
    case "EUR":
      showResult(amount.value, EUR, "€")
      break
    case "GBP":
      showResult(amount.value, GBP, "£")
      break
  }
}
```

Quando o formulario e enviado, `event.preventDefault()` impede que a pagina recarregue.

Depois, o `switch` verifica o valor selecionado no `select#currency`. Dependendo da moeda, chama `showResult()` passando tres informacoes:

- o valor digitado;
- a cotacao da moeda;
- o simbolo que sera exibido na tela.

### `convertCurrency(amount, price)`

```js
function convertCurrency(amount, price) {
  return amount * price
}
```

Essa funcao recebe o valor digitado e a cotacao da moeda. Ela retorna o resultado da multiplicacao.

Exemplo:

```text
convertCurrency(100, 5.14)
Resultado: 514
```

### `formatCurrency(value)`

```js
function formatCurrency(value) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}
```

Essa funcao formata numeros no padrao brasileiro.

Ela garante:

- separador decimal com virgula;
- sempre duas casas decimais;
- formato consistente tanto para cotacoes quanto para resultados.

Exemplos:

```text
5.14 vira 5,14
514 vira 514,00
1234.5 vira 1.234,50
```

### `showResult(amount, price, symbol)`

```js
function showResult(amount, price, symbol) {
  const convertedAmount = convertCurrency(amount, price)

  description.textContent = `${symbol} 1 = R$ ${formatCurrency(price)}`
  result.textContent = `${formatCurrency(convertedAmount)} Reais`

  footer.classList.add("show-result")
}
```

Essa funcao coordena a exibicao do resultado.

Ela faz quatro coisas:

1. chama `convertCurrency()` para calcular o valor em reais;
2. atualiza `description` com a cotacao formatada;
3. atualiza `result` com o valor convertido e formatado;
4. adiciona `show-result` ao `footer`, deixando a area de resultado visivel.

## Exemplo de conversao

Se o usuario digitar `100` e escolher `Dolar Americano`, o fluxo sera:

```text
Valor digitado: 100
Moeda escolhida: USD
Cotacao usada: 5.14
Calculo: 100 * 5.14 = 514
Resultado exibido: 514,00 Reais
Descricao exibida: US$ 1 = R$ 5,14
```

## Como adicionar uma nova moeda

Para adicionar outra moeda, e necessario alterar dois arquivos.

No `index.html`, adicione uma nova opcao no `select`:

```html
<option value="CAD">Dolar Canadense</option>
```

No `main.js`, crie uma constante com a cotacao:

```js
const CAD = 3.80
```

Depois, adicione um novo `case` no `switch`:

```js
case "CAD":
  showResult(amount.value, CAD, "C$")
  break
```

## Limitacoes atuais

- As cotacoes sao fixas no codigo.
- A aplicacao nao consome API de cambio.
- O campo de valor aceita apenas numeros inteiros.
- O resultado so converte para reais.

## Possiveis melhorias

- Permitir valores com centavos.
- Buscar cotacoes atualizadas em uma API.
- Exibir mensagens de erro personalizadas.
- Adicionar mais moedas.
- Separar as moedas em uma estrutura de dados para reduzir repeticao no `switch`.
