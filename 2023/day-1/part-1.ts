import { readFileSync } from "fs";

const fileName = 'part-1-input';
const data = readFileSync(fileName, 'utf-8');

let sum = 0;
const lines = data.split('\n');
for (const line of lines) {
    if (!line) {
        break;
    }
    let firstNumber = NaN;
    let lastNumber = NaN;

    // console.log('line', line)
    for (const char of line) {
        const number = Number(char);
        if (!number) {
            continue;
        }

        if (Number.isNaN(firstNumber)) {
            firstNumber = number;
        }
        lastNumber = number
    }

    const lineNumber = (firstNumber * 10) + lastNumber;
    // console.log("line number", lineNumber);
    sum += lineNumber;
}

console.log("sum", sum);
