import { readFileSync } from "fs";

const fileName = process.env.FILE_NAME ?? 'input.txt';
const data = readFileSync(fileName, 'utf-8');
// console.log('data', data);

type Race = {
    time: number;
    distance: number;
}

const lines = data.split('\n');
const times = lines[0].split(' ').filter((time) => time !== '');
const distances = lines[1].split(' ').filter((time) => time !== '');

if (times.length !== distances.length) {
    throw new Error('Time and distance lines should match');
}

const racesToBeat: Race[] = [];
for (let i = 1; i < times.length; i++) {
    racesToBeat.push({
        time: Number(times[i]),
        distance: Number(distances[i]),
    });
}

// console.log('allowed races', racesToBeat);

const speed = 1;
const winnableConditions: number[] = [];
for (const raceToBeat of racesToBeat) {
    let winnableCondition = 0;
    let timeSpentOnButton = 0;

    while (timeSpentOnButton < raceToBeat.time) {
        let timeSpentOnRace = raceToBeat.time - timeSpentOnButton;
        let acceleratedSpeed = speed * timeSpentOnButton;
        let distance = acceleratedSpeed * timeSpentOnRace;

        if (distance > raceToBeat.distance) {
            winnableCondition++;
        }

        timeSpentOnButton++;
    }

    winnableConditions.push(winnableCondition);
}

console.log('winnable conditions', winnableConditions);

const winnableNumber = winnableConditions
    .reduce((previousValue, currentValue) => previousValue * currentValue, 1);

console.log('number of ways to win', winnableNumber);

