import { readFileSync } from "fs";

type FoodProduction = {
    state: string;
    seeds: number[];
}

type FertilizedMap = {
    sourceStart: number;
    destinationStart: number;
    rangeLength: number;
}

type FertilizerSchema = {
    from: string;
    to: string;
    customMaps: FertilizedMap[];
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
    // console.log('line', line);

    let isEmptyLine = !line.length;
    if (isEmptyLine) {
        continue;
    }

    const newSchema: FertilizerSchema = {
        from: '',
        to: '',
        customMaps: [],
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
        // console.log('next line', nextLine);

        const isNewLineEmpty = !nextLine.length;
        if (isNewLineEmpty) {
            break;
        }

        const [destinationStart, sourceStart, rangeLength] =
            nextLine.split(' ');

        newSchema.customMaps.push({
            sourceStart: Number(sourceStart),
            destinationStart: Number(destinationStart),
            rangeLength: Number(rangeLength),
        });
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
    // console.log('schema to update', fertilizerSchema);

    const fertilizedSeeds = food.seeds.map((seed) => {
        const fertilizerMap = fertilizerSchema.customMaps.find(
            (customMap) => {
                const sourceEnd = customMap.sourceStart + (customMap.rangeLength - 1);
                return seed >= customMap.sourceStart && seed <= sourceEnd;
            }
        );
        if (!fertilizerMap) {
            return seed;
        }

        const difference = seed - fertilizerMap.sourceStart;
        const newSeed = fertilizerMap.destinationStart + difference;

        return newSeed;
    });

    food.state = fertilizerSchema.to;
    food.seeds = fertilizedSeeds;

    // console.log('updated food', food);
}

console.log('food', food);

const fastestSeed = Math.min(...food.seeds);

console.log('fastest', fastestSeed);
