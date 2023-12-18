import { readFileSync } from "fs";

const fileName = process.env.FILE_NAME ?? 'input.txt';
const data = readFileSync(fileName, 'utf-8');
// console.log('data', data);
const lines = data.split('\n');

enum CardName {
    ACE = 'A',
    KING = 'K',
    QUEEN = 'Q',
    JACK = 'J',
    TEN = 'T',
    NINE = '9',
    EIGHT = '8',
    SEVEN = '7',
    SIX = '6',
    FIVE = '5',
    FOUR = '4',
    THREE = '3',
    TWO = '2',
}

type Card = {
    name: CardName;
    power: number;
}

const cardPower = new Map<CardName, number>([
    [CardName.ACE, 14],
    [CardName.KING, 13],
    [CardName.QUEEN, 12],
    [CardName.JACK, 11],
    [CardName.TEN, 10],
    [CardName.NINE, 9],
    [CardName.EIGHT, 8],
    [CardName.SEVEN, 7],
    [CardName.SIX, 6],
    [CardName.FIVE, 5],
    [CardName.FOUR, 4],
    [CardName.THREE, 3],
    [CardName.TWO, 2],
]);

enum CombinationName {
    FIVE_OF_A_KIND = 'five of a kind',
    FOUR_OF_A_KIND = 'four of a kind',
    FULL_HOUSE = 'full house',
    THREE_OF_A_KIND = 'three of a kind',
    TWO_PAIR = 'two pair',
    ONE_PAIR = 'one pair',
    HIGH_CARD = 'high card',
}

type Combination = {
    name: CombinationName;
    power: number;
}

const combinationPower = new Map<CombinationName, number>([
    [CombinationName.FIVE_OF_A_KIND, 7],
    [CombinationName.FOUR_OF_A_KIND, 6],
    [CombinationName.FULL_HOUSE, 5],
    [CombinationName.THREE_OF_A_KIND, 4],
    [CombinationName.TWO_PAIR, 3],
    [CombinationName.ONE_PAIR, 2],
    [CombinationName.HIGH_CARD, 1],
]);

type CombinationRule = {
    setsOfSameLabel: number[];
}

const combinationRules = new Map<CombinationName, CombinationRule>([
    [CombinationName.FIVE_OF_A_KIND, {
        setsOfSameLabel: [5],
    }],
    [CombinationName.FOUR_OF_A_KIND, {
        setsOfSameLabel: [4],
    }],
    [CombinationName.FULL_HOUSE, {
        setsOfSameLabel: [3, 2],
    }],
    [CombinationName.THREE_OF_A_KIND, {
        setsOfSameLabel: [3],
    }],
    [CombinationName.TWO_PAIR, {
        setsOfSameLabel: [2, 2],
    }],
    [CombinationName.ONE_PAIR, {
        setsOfSameLabel: [2],
    }],
    [CombinationName.HIGH_CARD, {
        setsOfSameLabel: [1],
    }],
])

type Hand = {
    cards: Card[];
    combination: Combination;
    bid: number;
};

type Player = {
    hand: Hand;
}

type MatchScore = {
    player: Player;
    rank: number;
}

const hands: Hand[] = [];
for (const line of lines) {
    // console.log('line', line);
    const [cardLine, bid] = line.split(' ');

    const cards: Card[] = [];
    for (const cardLabel of cardLine) {
        const power = cardPower.get(cardLabel as CardName);
        if (!power) {
            throw new Error(`Card ${cardLabel} not found`);
        }

        cards.push({
            name: cardLabel as CardName,
            power,
        });
    }


    const uniqueCards = new Set<CardName>();
    for (const card of cards) {
        uniqueCards.add(card.name);
    }
    // console.log('unique', uniqueCards);

    const setOfSameLabels: number[] = [];
    for (const uniqueCard of uniqueCards) {
        let matched = 0;
        for (const card of cards) {
            if (uniqueCard === card.name) {
                matched++;
            }
        }
        setOfSameLabels.push(matched);
    }
    setOfSameLabels.sort((a, b) => b - a);
    // console.log('set of labels matched', setOfSameLabels);

    let combinationName: CombinationName = CombinationName.HIGH_CARD;
    for (const [possibleCombination, rule] of combinationRules.entries()) {
        const ruleSet = rule.setsOfSameLabel;
        let isMatch = false;

        for (let j = 0; j < ruleSet.length; j++) {
            isMatch = ruleSet[j] === setOfSameLabels[j];

            if (!isMatch) {
                break;
            }
        }

        if (isMatch) {
            combinationName = possibleCombination;
            break;
        }
    }

    const power = combinationPower.get(combinationName);
    if (!power) {
        throw new Error(`Combination ${combinationName} not found.`);
    }

    const hand: Hand = {
        cards,
        combination: {
            name: combinationName,
            power,
        },
        bid: Number(bid),
    };
    // console.log('hand', hand);

    hands.push(hand);
}

// console.log('hands', hands);

const players: Player[] = [];
for (const hand of hands) {
    const player: Player = {
        hand,
    };
    // console.log('player', player);

    players.push(player);
}

players.sort((a, b) => {
    const combinationDiff = a.hand.combination.power - b.hand.combination.power;
    if (combinationDiff === 0) {
        for (let i = 0; i < a.hand.cards.length; i++) {
            const aCard = a.hand.cards[i];
            const bCard = b.hand.cards[i];
            if (!bCard) {
                throw new Error('Cards length should be the same on sort');
            }

            const cardDiff = aCard.power - bCard.power;
            if (cardDiff !== 0) {
                return cardDiff;
            }
        }
    }

    return combinationDiff;
});
// console.log('players', players);

const matchScores: MatchScore[] = [];

for (let i = 0; i < players.length; i++) {
    matchScores.push({
        player: players[i],
        rank: i + 1,
    });
}

// console.log('match scores', matchScores);

let totalWinning = 0;
for (const matchScore of matchScores) {
    totalWinning += matchScore.rank * matchScore.player.hand.bid;
}

console.log('total winning', totalWinning);
