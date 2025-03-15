const screen = document.querySelector('.screen');
let currentInput = '0';

function updateScreen() {
    screen.textContent = currentInput;
}

function addToScreen(value) {
    if (currentInput === '0' && value !== '÷' && value !== '×' && value !== '−' && value !== '+') {
        currentInput = value;
    } else {
        currentInput += value;
    }
    updateScreen();
    animateScreen();
}

function clearScreen() {
    currentInput = '0';
    updateScreen();
    animateScreen();
}

function backspace() {
    currentInput = currentInput.slice(0, -1);
    if (currentInput === '') {
        currentInput = '0';
    }
    updateScreen();
}

function calculate() {
    try {
        let expression = currentInput
            .replace('÷', '/')
            .replace('×', '*')
            .replace('−', '-');
        currentInput = eval(expression).toString();
        updateScreen();
        animateResult();
    } catch (error) {
        currentInput = 'Error';
        updateScreen();
        setTimeout(clearScreen, 1000);
    }
}

function animateScreen() {
    screen.style.transform = 'scale(1.05)';
    screen.style.opacity = '0.8';
    setTimeout(() => {
        screen.style.transform = 'scale(1)';
        screen.style.opacity = '1';
    }, 200);
}

function animateResult() {
    screen.style.color = '#00cec9';
    screen.style.transform = 'scale(1.1)';
    setTimeout(() => {
        screen.style.color = 'black';
        screen.style.transform = 'scale(1)';
    }, 300);
}

document.querySelectorAll('.calc-button').forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;
        if (value === 'C') {
            clearScreen();
        } else if (value === '←') {
            backspace();
        } else if (value === '=') {
            calculate();
        } else {
            addToScreen(value);
        }
    });
});

document.addEventListener('keydown', (event) => {
    if (event.key >= '0' && event.key <= '9') addToScreen(event.key);
    if (event.key === '.') addToScreen('.');
    if (event.key === '+') addToScreen('+');
    if (event.key === '-') addToScreen('−');
    if (event.key === '*') addToScreen('×');
    if (event.key === '/') addToScreen('÷');
    if (event.key === 'Enter') calculate();
    if (event.key === 'Backspace') backspace();
    if (event.key === 'Escape') clearScreen();
});