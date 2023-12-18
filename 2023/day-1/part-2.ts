import { readFileSync } from "fs";

type Digit = {
    spelling: string;
    value: number;
}
const digits: Digit[] = [
    {
        spelling: 'one',
        value: 1,
    },
    {
        spelling: 'two',
        value: 2,
    },
    {
        spelling: 'three',
        value: 3,
    },
    {
        spelling: 'four',
        value: 4,
    },
    {
        spelling: 'five',
        value: 5,
    },
    {
        spelling: 'six',
        value: 6,
    },
    {
        spelling: 'seven',
        value: 7,
    },
    {
        spelling: 'eight',
        value: 8,
    },
    {
        spelling: 'nine',
        value: 9,
    },
    {
        spelling: '1',
        value: 1,
    },
    {
        spelling: '2',
        value: 2,
    },
    {
        spelling: '3',
        value: 3,
    },
    {
        spelling: '4',
        value: 4,
    },
    {
        spelling: '5',
        value: 5,
    },
    {
        spelling: '6',
        value: 6,
    },
    {
        spelling: '7',
        value: 7,
    },
    {
        spelling: '8',
        value: 8,
    },
    {
        spelling: '9',
        value: 9,
    }
];

type SearchResult = {
    digit: Digit;
    index: number;
}

const fileName = 'part-2-input';
const data = readFileSync(fileName, 'utf-8');

let sum = 0;
const lines = data.split('\n');

for (const line of lines) {
    if (!line.length) {
        continue;
    }
    // console.log("line", line);

    let firstSearchResult: SearchResult = {
        digit: {
            spelling: '',
            value: NaN,
        },
        index: line.length,
    };
    for (const digit of digits) {
        let index = line.indexOf(digit.spelling);
        if (index === -1) {
            continue;
        }

        if (index < firstSearchResult.index) {
            firstSearchResult = {
                digit,
                index,
            };
        }
    }

    let lastSearchResult: SearchResult = {
        digit: {
            spelling: '',
            value: NaN,
        },
        index: -1,
    };
    for (const digit of digits) {
        let index = line.lastIndexOf(digit.spelling);
        if (index === -1) {
            continue;
        }

        if (index > lastSearchResult.index) {
            lastSearchResult = {
                digit,
                index,
            };
        }
    }

    const firstNumber = firstSearchResult.digit.value;
    const lastNumber = lastSearchResult.digit.value;
    const calibration = (firstNumber * 10) + lastNumber;
    // console.log("calibration", lineNumber);

    sum += calibration;
}

console.log("sum", sum);
