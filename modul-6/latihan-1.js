const display = document.getElementById("display");
const buttons = document.getElementById("buttons");

let firstValue = null;
let operator = null;
let waitingForSecond = false;

// update display
function updateDisplay(value) {
  display.textContent = value;
}

// input angka
function inputNumber(num) {
  if (waitingForSecond) {
    updateDisplay(num);
    waitingForSecond = false;
  } else {
    updateDisplay(display.textContent === "0" ? num : display.textContent + num);
  }
}

// input desimal
function inputDecimal() {
  if (!display.textContent.includes(".")) {
    updateDisplay(display.textContent + ".");
  }
}

// pilih operator
function handleOperator(op) {
  firstValue = parseFloat(display.textContent);
  operator = op;
  waitingForSecond = true;
}

// hitung hasil
function calculate() {
  const secondValue = parseFloat(display.textContent);

  if (operator && firstValue !== null) {
    let result;

    switch (operator) {
      case "+": result = firstValue + secondValue; break;
      case "-": result = firstValue - secondValue; break;
      case "*": result = firstValue * secondValue; break;
      case "/": result = secondValue === 0 ? "Error" : firstValue / secondValue; break;
      default: return;
    }

    updateDisplay(result);
    firstValue = null;
    operator = null;
    waitingForSecond = false;
  }
}

// clear
function clearDisplay() {
  updateDisplay("0");
  firstValue = null;
  operator = null;
  waitingForSecond = false;
}

// EVENT DELEGATION (1 listener)
buttons.addEventListener("click", (e) => {
  const target = e.target;

  if (!target.matches("button")) return;

  const value = target.dataset.value;
  const action = target.dataset.action;

  if (value) {
    if (!isNaN(value)) {
      inputNumber(value);
    } else if (value === ".") {
      inputDecimal();
    } else {
      handleOperator(value);
    }
  }

  if (action === "equal") calculate();
  if (action === "clear") clearDisplay();
});

// KEYBOARD SUPPORT
document.addEventListener("keydown", (e) => {
  if (!isNaN(e.key)) inputNumber(e.key);
  if (e.key === ".") inputDecimal();

  if (["+", "-", "*", "/"].includes(e.key)) {
    handleOperator(e.key);
  }

  if (e.key === "Enter") calculate();
  if (e.key === "Escape") clearDisplay();
});