import { readFileSync } from "fs";

type FoodProduction = {
    state: string;
    seeds: number[];
}

type FertilizerSchema = {
    from: string;
    to: string;
    customMap: Map<number, number>;
}

const fileName = process.env.FILE_NAME ?? 'input.txt';
const data = readFileSync(fileName, 'utf-8');
// console.log('data', data);

const lines = data.split('\n');
const [title, seedsLine] = lines[0].split(': ');
const seeds = seedsLine.split(' ').map((seed) => Number(seed));
const schemas: FertilizerSchema[] = [];

for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    console.log('line', line);

    let isEmptyLine = !line.length;
    if (isEmptyLine) {
        continue;
    }

    const newSchema: FertilizerSchema = {
        from: '',
        to: '',
        customMap: new Map<number, number>(),
    };

    const isMapLine = line.includes('map');
    if (isMapLine) {
        const [title] = line.split(' ');
        const [source, destination] = title.split('-to-');
        newSchema.from = source;
        newSchema.to = destination;
    }

    while (i + 1 < lines.length) {
        i++;
        const nextLine = lines[i];
        console.log('next line', nextLine);

        const isNewLineEmpty = !nextLine.length;
        if (isNewLineEmpty) {
            break;
        }

        const schemaValues =
            nextLine.split(' ');
        const [destinationStart, sourceStart, rangeLength] = schemaValues.map((value) => Number(value));

        for (let j = 0; j < rangeLength; j++) {
            const sourceNumber = sourceStart + j;
            const destinationNumber = destinationStart + j;
            newSchema.customMap.set(sourceNumber, destinationNumber);
        }
    }

    // console.log('new schema', newSchema);
    schemas.push(newSchema);
}

// console.log('schemas', schemas);
const startFertilizer = 'seed';
const endFertilizer = 'location';

const food: FoodProduction = {
    state: startFertilizer,
    seeds,
};

while (food.state !== endFertilizer) {
    const fertilizerSchema = schemas.find((schema) => {
        return schema.from === food.state;
    });
    if (!fertilizerSchema) {
        throw new Error(`Schema '${food.state}' not found.`);
    }

    const fertilizedSeeds = food.seeds.map((seed) => {
        if (fertilizerSchema.customMap.has(seed)) {
            return fertilizerSchema.customMap.get(seed)!;
        }

        return seed;
    });

    food.state = fertilizerSchema.to;
    food.seeds = fertilizedSeeds;
}

console.log('food', food);

const fastestSeed = Math.min(...food.seeds);

console.log('fastest', fastestSeed);
