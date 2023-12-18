import { readFileSync } from "fs";

type SeedRange = {
    startIndex: number;
    range: number;
}

type FoodProduction = {
    state: string;
    seedRanges: SeedRange[];
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

const seedRanges: SeedRange[] = [];
const seedAndSchemas = seedsLine.split(' ');
for (let i = 0; i < seedAndSchemas.length; i += 2) {
    const startIndex = seedAndSchemas[i];
    const range = seedAndSchemas[i + 1];

    seedRanges.push({
        startIndex: Number(startIndex),
        range: Number(range),
    })
}

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

const sliceRange = (range: SeedRange, map: FertilizedMap): SeedRange[] => {
    const ranges: SeedRange[] = [];

    while (range.range > 0) {
        console.log('range', range);
        console.log('map', map);

        const rangeEndIndex = range.startIndex + range.range - 1;
        const mapEndIndex = map.sourceStart + map.rangeLength - 1;

        if (rangeEndIndex < map.sourceStart) {
            ranges.push(range);
            break;
        }

        if (mapEndIndex < range.startIndex) {
            ranges.push(range);
            break;
        }

        const isInStartRange = range.startIndex >= map.sourceStart;

        const isInEndRange = rangeEndIndex <= mapEndIndex;

        const isInRange = isInStartRange && isInEndRange;
        if (isInRange) {
            ranges.push(range);
            break;
        }

        const endDifference = rangeEndIndex - mapEndIndex;
        const startDifference = range.startIndex - map.sourceStart;
        const isBiggerRange = range.range > map.rangeLength;

        if (!isInStartRange && !isInEndRange) {
            console.log('is out');
            const newRange: SeedRange = {
                startIndex: map.sourceStart,
                range: map.rangeLength,
            };
            ranges.push(newRange);

            const outOfStartRange: SeedRange = {
                startIndex: range.startIndex,
                range: startDifference,
            }
            ranges.push(outOfStartRange);

            const outOfEndRange: SeedRange = {
                startIndex: rangeEndIndex,
                range: endDifference,
            }
            ranges.push(outOfEndRange);

            break;
        }

        if (isInStartRange) {
            console.log('in start');
            const newRange: SeedRange = {
                startIndex: range.startIndex,
                range: isBiggerRange ? range.range - endDifference : range.range,
            };

            range.startIndex += newRange.range;
            range.range -= newRange.range;

            const newRanges = sliceRange(newRange, map);
            for (const newSplicedRange of newRanges) {
                ranges.push(newSplicedRange);
            }

            continue;
        }

        if (isInEndRange) {
            console.log('in end');
            const newRange: SeedRange = {
                startIndex: map.sourceStart,
                range: range.range - startDifference,
            };

            range.range -= newRange.range;

            const newRanges = sliceRange(newRange, map);
            for (const newSplicedRange of newRanges) {
                ranges.push(newSplicedRange);
            }

            continue;
        }
    }

    return ranges;
};


const sliceRangeByMaps = (range: SeedRange, maps: FertilizedMap[]) => {
    let slicedRanges: SeedRange[] = [];

    for (let i = 0; i < maps.length; i++) {
        const map = maps[i];

        const newRanges = sliceRange(range, map);
        for (const newRange of newRanges) {
            const existedRange = slicedRanges.find((range) => {
                return range.range === newRange.range && range.startIndex === newRange.startIndex;
            })

            if (!existedRange) {
                slicedRanges.push(newRange);
            }
        }
    }

    return slicedRanges;
}

const sliceRanges = (ranges: SeedRange[], maps: FertilizedMap[]) => {
    let slicedRanges: SeedRange[] = [];
    for (let i = 0; i < ranges.length; i++) {
        const range = ranges[i];

        const newRanges: SeedRange[] = sliceRangeByMaps(range, maps);
        for (const newRange of newRanges) {
            slicedRanges.push(newRange);
        }
    }

    return slicedRanges;
}

const startFertilizer = 'seed';
const endFertilizer = 'location';
// const endFertilizer = 'soil';
// const endFertilizer = 'fertilizer';

const food: FoodProduction = {
    state: startFertilizer,
    seedRanges,
};
console.log('initial food', food);

while (food.state !== endFertilizer) {
    const fertilizerSchema = schemas.find((schema) => {
        return schema.from === food.state;
    });
    if (!fertilizerSchema) {
        throw new Error(`Schema '${food.state}' not found.`);
    }
    console.log('schema to update', fertilizerSchema);

    const optimizedRanges = sliceRanges(food.seedRanges, fertilizerSchema.customMaps);
    console.log('optimized ranges', optimizedRanges);

    const fertilizedRanges = optimizedRanges.map((seedRange) => {
        const fertilizerMap = fertilizerSchema.customMaps.find(
            (customMap) => {
                const sourceEnd = customMap.sourceStart + (customMap.rangeLength - 1);
                return seedRange.startIndex >= customMap.sourceStart && seedRange.startIndex <= sourceEnd;
            }
        );
        if (!fertilizerMap) {
            return seedRange;
        }

        const difference = seedRange.startIndex - fertilizerMap.sourceStart;
        const newSeed: SeedRange = {
            startIndex: fertilizerMap.destinationStart + difference,
            range: seedRange.range,
        };

        return newSeed;
    });

    food.state = fertilizerSchema.to;
    food.seedRanges = fertilizedRanges;

    console.log('updated food', food);
}

// console.log('food', food);

let fastestSeed = Infinity;
for (let i = 0; i < food.seedRanges.length; i++) {
    const range = food.seedRanges[i];
    if (range.startIndex < fastestSeed) {
        fastestSeed = range.startIndex;
    }
}

console.log('fastest', fastestSeed);
