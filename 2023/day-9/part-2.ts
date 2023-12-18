import { readFileSync } from "fs";

const fileName = process.env.FILE_NAME ?? 'input.txt';
const data = readFileSync(fileName, 'utf-8');
// console.log('data', data);
const lines = data.split('\n');

const reports: number[][] = [];
for (const line of lines) {
    const numbers = line.split(' ');
    reports.push(numbers.map((number) => Number(number)));
}
console.log('reports', reports);

const getAllDifferences = (differences: number[][], differenceToCheck: number): number[][] => {
    const lastDifferences: number[] = [];
    for (let i = 0; i < differences[differenceToCheck].length - 1; i++) {
        const difference = differences[differenceToCheck][i + 1] - differences[differenceToCheck][i];
        lastDifferences.push(difference);
    }
    differences.push(lastDifferences);

    const nonZeroDifference = lastDifferences.find((difference) => difference !== 0);
    if (nonZeroDifference) {
        getAllDifferences(differences, differenceToCheck + 1);
    }

    return differences;
}

const findPreviousPrediction = (report: number[]): number => {
    const differences = getAllDifferences([report], 0);
    console.log('differences', differences);

    let prediction = 0;
    for (let i = differences.length - 1; i > 0; i--) {
        // const lastDifferences = differences[i];
        // const lastDifference = lastDifferences[lastDifferences.length - 1];
        // console.log('last difference', lastDifference);

        const previousDifferences = differences[i - 1];
        const previousDifference = previousDifferences[0];
        console.log('previous difference', previousDifference);

        prediction = previousDifference - prediction;
        // prediction += lastDifference + previousDifference;
    }
    console.log('prediction', prediction);

    return prediction;
}

let sum = 0;
for (const report of reports) {
    const predictedValue = findPreviousPrediction(report);
    sum += predictedValue;
}

console.log('sum', sum);
