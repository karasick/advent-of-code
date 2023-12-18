import { readFileSync } from "fs";

type EnginePart = {
    partNumber: string;
    startIndex: number;
    endIndex: number;
}

const fileName = process.env.FILE_NAME ?? 'input.txt';
const data = readFileSync(fileName, 'utf-8');
const lines = data.split('\n');

const isConnectedToEngine = (possiblePart: EnginePart, line: string): boolean => {
    let isConnected = false;
    let startIndex = possiblePart.startIndex - 1;
    if (startIndex < 0) {
        startIndex = 0;
    }
    let EndIndex = possiblePart.endIndex + 1;
    if (EndIndex >= line.length) {
        EndIndex = line.length;
    }
    const searchLine = line.slice(startIndex, EndIndex + 1);
    // console.log('search line', previousSearchLine);
    for (const char of searchLine) {
        const isNumber = !Number.isNaN(Number(char));
        const isDot = char === '.';

        if (!isNumber && !isDot) {
            isConnected = true;
            break;
        }
    }

    return isConnected;
}

let sum = 0;
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // console.log('line', line);
    let previousLine = '';
    if (i - 1 >= 0) {
        previousLine = lines[i - 1];
    }
    let nextLine = '';
    if (i + 1 < lines.length) {
        nextLine = lines[i + 1];
    }

    let possiblePart: EnginePart = {
        partNumber: '',
        startIndex: -1,
        endIndex: -1,
    };
    for (let j = 0; j < line.length; j++) {
        const char = line[j];
        // console.log('char', char);
        const isNumber = !Number.isNaN(Number(char));
        if (isNumber) {
            possiblePart.partNumber += char;
            if (possiblePart.startIndex === -1) {
                possiblePart.startIndex = j;
            }
            possiblePart.endIndex = j;
            if (j !== line.length - 1) {
                continue;
            }
        }
        // console.log('possible part', possiblePart);

        const isDot = char === '.';
        if (isDot && !possiblePart.partNumber.length) {
            continue;
        }

        const isInPreviousLine = isConnectedToEngine(possiblePart, previousLine);
        const isInCurrentLine = isConnectedToEngine(possiblePart, line);
        const isInNextLine = isConnectedToEngine(possiblePart, nextLine);

        if (isInNextLine || isInPreviousLine || isInCurrentLine) {
            sum +=  Number(possiblePart.partNumber);
        }

        possiblePart = {
            partNumber: '',
            startIndex: -1,
            endIndex: -1,
        }

        // console.log('temp sum', sum);
    }
}

console.log('sum', sum);
