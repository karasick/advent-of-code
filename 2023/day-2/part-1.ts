import { readFileSync } from "fs";

type Game = {
    id: number;
    line: string;
}

enum CubeColor {
    RED = 'red',
    GREEN = 'green',
    BLUE = 'blue',
}

type GameSet = {
    [color in CubeColor]: number;
}

const data = readFileSync('input.txt', 'utf-8');
const lines = data.split('\n');

const games: Game[] = [];
for (const line of lines) {
    const [title, inputLine] = line.split(': ');
    const [_, id] = title.split(' ');
    games.push({
        id: Number(id),
        line: inputLine,
    })
}

const possibleGame: GameSet = {
    [CubeColor.RED]: 12,
    [CubeColor.GREEN]: 13,
    [CubeColor.BLUE]: 14,
};
let sum = 0;
for (const game of games) {
    // console.log('game', game);

    const sets = game.line.split('; ');

    let isPossible = true;
    for (const set of sets) {
        const cubes = set.split(', ');

        const gameSet: GameSet = {
            [CubeColor.RED]: 0,
            [CubeColor.GREEN]: 0,
            [CubeColor.BLUE]: 0,
        };
        for (const cube of cubes) {
            const [amount, color] = cube.split(' ');

            gameSet[color as CubeColor] = Number(amount);
        }

        for (const color of Object.values(CubeColor)) {
            const cubeColor = color as CubeColor;
            if (gameSet[cubeColor] > possibleGame[cubeColor]) {
                isPossible = false;
            }
        }
        // console.log('game set', gameSet);
    }

    if (isPossible) {
        sum += game.id;
    }
}

console.log('sum', sum);
