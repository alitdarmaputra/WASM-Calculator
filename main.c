#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <emscripten.h>

#ifdef __cplusplus
#define EXTERN extern "C"
#else
#define EXTERN 
#endif

typedef struct {
    char previousOperand[255];
    char currentOperand[255];
    char operator;
} Calculator;

void slice(const char *str, char *result, size_t start, size_t end)
{
    strncpy(result, str + start, end - start);
}

int isInt(float N) {
    int X = N;
    float diff = N - X;
    return diff > 0 ? 0 : 1;
}

Calculator calculator = {"", "", '\0'};

EXTERN EMSCRIPTEN_KEEPALIVE void clear() {
    memset(calculator.currentOperand,0,255);
    memset(calculator.previousOperand,0,255);
    calculator.operator = '\0';
}

EXTERN EMSCRIPTEN_KEEPALIVE void appendNumber(int number) {
    int ch = '.';
    if (number == '.' && strchr(calculator.currentOperand, ch) != NULL) {
        return;
    }
    char buff[2] = { number, '\0' };
    strcat(calculator.currentOperand, buff);
}

EXTERN EMSCRIPTEN_KEEPALIVE void delete() {
    char buffer[255];
    memset(buffer, '\0', sizeof(buffer));
    if(strlen(calculator.currentOperand) > 0) {
        slice(calculator.currentOperand, buffer, 0, strlen(calculator.currentOperand)-1);
        strcpy(calculator.currentOperand, buffer);
    }
}

EXTERN EMSCRIPTEN_KEEPALIVE void compute() {
    float result;
    if(strcmp(calculator.previousOperand, "") == 0) return;
    float prev = atof(calculator.previousOperand);
    float curr = atof(calculator.currentOperand);

    switch (calculator.operator) {
        case '+':
            result = prev + curr;
            break;
        case '-':
            result = prev - curr;
            break;
        case '*':
            result = prev * curr;
            break;
        case '/':
            result = prev / curr;
            break;
    }
    
    if(isInt(result)) {
        sprintf(calculator.currentOperand, "%d", (int)result);
    } else {
        sprintf(calculator.currentOperand, "%.2f", result);
    }

    calculator.operator = '\0';
    strcpy(calculator.previousOperand, "");
}

EXTERN EMSCRIPTEN_KEEPALIVE void chooseOperator(int operator) {
    if(strcmp(calculator.currentOperand, "") == 0) {
        return;
    }
    
    if(strcmp(calculator.previousOperand, "") != 0) {
        compute();
    }

    calculator.operator = operator;
    strcpy(calculator.previousOperand, calculator.currentOperand);
    memset(calculator.currentOperand,0,255);
}

EXTERN EMSCRIPTEN_KEEPALIVE char* getOperatorOff() {
    return &calculator.operator;
}

EXTERN EMSCRIPTEN_KEEPALIVE char* getCurrentOperandOff() {
    return &calculator.currentOperand[0];
}

EXTERN EMSCRIPTEN_KEEPALIVE char* getPreviousOperandOff() {
    return &calculator.previousOperand[0];
}

