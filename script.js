const numberButton = document.querySelectorAll(".number");
const operatorButton = document.querySelectorAll(".operator");
const equalsButton = document.querySelector(".equals");
const deleteButton = document.querySelector(".delete");
const allClearButton = document.querySelector(".all-clear");
const previousOperandTextElement = document.querySelector(".previous-operand");
const currentOperandTextElement = document.querySelector(".current-operand");

let wasmExport;
let currOperandArr;
let prevOperandArr;
let operatorArr;

function getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];

    let integerDisplay;

    if (isNaN(integerDigits)) {
        integerDisplay = '';
    } else {
        integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
    }

    if (decimalDigits != null) {
        return `${integerDisplay}.${decimalDigits}`;
    } else {
        return integerDisplay;
    }
}

function itoa(arr) {
    return String.fromCharCode.apply(null, arr);
}

function updateDisplay() {
    let currentOperand = itoa(currOperandArr);
    currentOperandTextElement.innerText = getDisplayNumber(currentOperand);

    if (operatorArr[0] != 0) {
        let operator = itoa(operatorArr);
        operator = operator == '/' ? '÷' : operator;
        if (operator == '/') {
            operator = '÷';
        } else if (operator == '*') {
            operator = '×';
        } else {
            operator = operator;
        }

        let previousOperand = itoa(prevOperandArr);
        previousOperandTextElement.innerText = `${getDisplayNumber(previousOperand)} ${operator}`;
    } else {
        previousOperandTextElement.innerText = "";
    }
}

async function loadWasm() {
    wasmExport = await WebAssembly.instantiateStreaming(fetch("main.wasm")).then(obj => obj.instance.exports);
    currOperandArr = new Uint8Array(
        wasmExport.memory.buffer,
        wasmExport.getCurrentOperandOff(),
        255
    )

    prevOperandArr = new Uint8Array(
        wasmExport.memory.buffer,
        wasmExport.getPreviousOperandOff(),
        255
    )

    operatorArr = new Uint8Array(
        wasmExport.memory.buffer,
        wasmExport.getOperatorOff(),
        1
    );
}

loadWasm();

numberButton.forEach(button => {
    button.addEventListener("click", () => {
        wasmExport.appendNumber(button.innerText.charCodeAt(0));
        updateDisplay();
    });
});

operatorButton.forEach(button => {
    button.addEventListener("click", () => {
        if (button.innerText == '÷') {
            wasmExport.chooseOperator("/".charCodeAt(0));
        } else if (button.innerText == "×") {
            wasmExport.chooseOperator("*".charCodeAt(0));
        } else {
            wasmExport.chooseOperator(button.innerText.charCodeAt(0));
        }
        updateDisplay();
    });
});

equalsButton.addEventListener("click", () => {
    wasmExport.compute();
    updateDisplay()
});

allClearButton.addEventListener("click", () => {
    wasmExport.clear()
    updateDisplay()
});

deleteButton.addEventListener("click", () => {
    wasmExport.delete()
    updateDisplay()
});
