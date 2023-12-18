import { readFileSync } from "fs";

type CardSet = {
    id: number;
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
        id: Number(id),
        winCards: filterCards(winLine),
        ownedCards: filterCards(ownLine),
    });
}
// console.log('card sets', cardSets);

const scratchcards = new Map<number, number>();

for (const set of cardSets) {
    const wonCards = set.ownedCards.filter((card) => set.winCards.includes(card));
    // console.log('set', set);


    let setCardAmount = 1;
    if (scratchcards.has(set.id)) {
        setCardAmount += scratchcards.get(set.id) ?? 0;
    }

    // console.log('set card id amount', set.id, setCardAmount);
    scratchcards.set(set.id, setCardAmount);

    for (let i = 1; i <= wonCards.length; i++) {
        const bonusCardId = set.id + i;

        let bonusCardAmount = setCardAmount;
        if (scratchcards.has(bonusCardId)) {
            bonusCardAmount += scratchcards.get(bonusCardId) ?? 0;
        }

        // console.log('bonus card id amount', bonusCardId, bonusCardAmount);
        scratchcards.set(bonusCardId, bonusCardAmount);
    }
}

let sum = 0;
for (const scratchcardAmount of scratchcards.values()) {
    sum += scratchcardAmount;
}

console.log('sum', sum);
