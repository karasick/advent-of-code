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

let sum = 0;
for (const game of games) {
    // console.log('game', game);

    const sets = game.line.split('; ');

    const minimumPossibleGameSet: GameSet = {
        [CubeColor.RED]: 0,
        [CubeColor.GREEN]: 0,
        [CubeColor.BLUE]: 0,
    };
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
            if (gameSet[cubeColor] > minimumPossibleGameSet[cubeColor]) {
                minimumPossibleGameSet[cubeColor] = gameSet[color];
            }
        }
        // console.log('game set', gameSet);
    }

    const power =
        minimumPossibleGameSet[CubeColor.RED] *
        minimumPossibleGameSet[CubeColor.GREEN] *
        minimumPossibleGameSet[CubeColor.BLUE];

    sum += power;
}

console.log('sum', sum);
