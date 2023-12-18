import { readFileSync } from "fs";

type CardSet = {
    // id: number;
    winCards: number[];
    ownedCards: number[];
}

const fileName = process.env.FILE_NAME ?? 'input.txt';
const data = readFileSync(fileName, 'utf-8');
// console.log('data', data);

const lines = data.split('\n');
const cardSets: CardSet[] = [];

for (const line of lines) {
    // console.log('line', line);

    const [title, cards] = line.split(': ');
    const [name, id] = title.split(' ').filter((card) => card !== '');
    const [winLine, ownLine] = cards.split(' | ');

    const filterCards = (cardsLine: string): number[] => {
     return cardsLine.split(' ')
         .filter((card) => card !== '')
         .map((card) => Number(card));
    }

    cardSets.push({
        // id: Number(id),
        winCards: filterCards(winLine),
        ownedCards: filterCards(ownLine),
    });
}
// console.log('card sets', cardSets);

const calculatePoints = (amount: number) => {
    return 2 ** (amount - 1);
}

let sum = 0;
for (const set of cardSets) {
    const wonCards = set.ownedCards.filter((card) => set.winCards.includes(card));

    if (wonCards.length > 0) {
        const winPoints = calculatePoints(wonCards.length);
        // console.log('win points', winPoints);
        sum += winPoints;
    }
}

console.log('sum', sum);
