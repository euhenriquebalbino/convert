const USD = 5.14
const EUR = 6.01
const GBP = 7.01

const form = document.querySelector("form")
const amount = document.getElementById("amount")
const currency = document.getElementById("currency")
const footer = document.querySelector("main footer")
const description = document.getElementById("description")
const result = document.getElementById("result")

amount.addEventListener("input", () => {
  const hasCharacterRegex = /\D+/g
  amount.value = amount.value.replace(hasCharacterRegex, "")
})

form.onsubmit = (event) => {
  event.preventDefault()
  switch (currency.value){
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

function convertCurrency(amount, price) {
  return amount * price
}

function formatCurrency(value) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

function showResult(amount, price, symbol) {
  const convertedAmount = convertCurrency(amount, price)

  description.textContent = `${symbol} 1 = R$ ${formatCurrency(price)}`
  result.textContent = `${formatCurrency(convertedAmount)} Reais`

  footer.classList.add("show-result")
}
