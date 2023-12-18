import { readFileSync } from "fs";

type EnginePart = {
    partNumber: string;
    startIndex: number;
    endIndex: number;
}

const fileName = process.env.FILE_NAME ?? 'input.txt';
const data = readFileSync(fileName, 'utf-8');
const lines = data.split('\n');

const getConnectedParts = (connectionIndex: number, line: string): EnginePart[] => {
    const parts: EnginePart[] = [];

    let startIndex = connectionIndex - 1;
    if (startIndex < 0) {
        startIndex = 0;
    }
    let endIndex = connectionIndex + 1;
    if (endIndex >= line.length) {
        endIndex = line.length;
    }
    // console.log('line j-1 j+1', startIndex, endIndex);
    let possiblePart: EnginePart = {
        partNumber: '',
        startIndex: -1,
        endIndex: -1,
    };
    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        const isDot = char === '.';
        if (isDot && !possiblePart.partNumber.length) {
            continue;
        }

        const isNumber = !Number.isNaN(Number(char));
        if (isNumber) {
            possiblePart.partNumber += char;
            if (possiblePart.startIndex === -1) {
                possiblePart.startIndex = i;
            }
            possiblePart.endIndex = i;
            if (i !== line.length - 1) {
                continue;
            }
        }

        // console.log('line possible part', possiblePart);

        if ((
            possiblePart.startIndex <= startIndex ||
            possiblePart.startIndex <= endIndex
        ) && (
            possiblePart.endIndex >= startIndex ||
            possiblePart.endIndex >= endIndex
        )) {
            parts.push(possiblePart);
        }

        possiblePart = {
            partNumber: '',
            startIndex: -1,
            endIndex: -1,
        };
    }

    return parts;
}

let sum = 0;
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // console.log('line', line);
    let previousLine = '';
    if (i - 1 >= 0) {
        previousLine = lines[i - 1];
    }
    // console.log('previous line', previousLine);
    let nextLine = '';
    if (i + 1 < lines.length) {
        nextLine = lines[i + 1];
    }
    // console.log('next line', nextLine);

    for (let j = 0; j < line.length; j++) {
        const char = line[j];
        // console.log('char', char);

        const isStar = char === '*';
        if (!isStar) {
            continue;
        }
        // console.log('isStar i j', i, j)

        const previousLineParts = getConnectedParts(j, previousLine);
        const currentLineParts = getConnectedParts(j, line);
        const nextLineParts = getConnectedParts(j, nextLine);

        const parts: EnginePart[] = [...previousLineParts, ...currentLineParts, ...nextLineParts];

        if (parts.length == 2) {
            const gearRation = Number(parts[0].partNumber) * Number(parts[1].partNumber);
            sum += gearRation;
        }

        // console.log('temp sum', sum);
    }
}

console.log('sum', sum);
