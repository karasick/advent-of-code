import { readFileSync } from "fs";

const fileName = process.env.FILE_NAME ?? 'input.txt';
const data = readFileSync(fileName, 'utf-8');
// console.log('data', data);
const lines = data.split('\n');

enum MoveDirection {
    LEFT = 'L',
    RIGHT = 'R',
}

type ElementNode = {
    name: string;
    [MoveDirection.LEFT]: string;
    [MoveDirection.RIGHT]: string;
}

type Walk = {
    startNode: string;
    endCondition: (node: string) => boolean;
    currentNode: string;
}

const moveRule: MoveDirection[] = [];
const moveOperators = lines[0].split('');
for (const moveOperator of moveOperators) {
    moveRule.push(moveOperator as MoveDirection);
}
// console.log('move rule', moveRule);

const networkNodes: ElementNode[] = [];
for (const line of lines.slice(2)) {
    const [node, gates] = line.split(' = ');
    const [leftGate, rightGate] = gates.slice(1, -1).split(', ');
    networkNodes.push({
        name: node,
        [MoveDirection.RIGHT]: rightGate,
        [MoveDirection.LEFT]: leftGate,
    });
}
// console.log('network', networkNodes);

const walks: Walk[] = [];
for (const node of networkNodes) {
    if (node.name[2] === 'A') {
        walks.push({
            startNode: node.name,
            endCondition: (nodeName: string) => nodeName[2] === 'Z',
            currentNode: node.name,
        });
    }
}
console.log('walks', walks);

const lcm = (arr: number[]): number => {
    return arr.reduce((acc, n) => (acc * n) / gcd(acc, n));
}

const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
}

const stepsByWalk: number[] = [];
for (const walk of walks) {
    let steps = 0;
    let currentRule = 0;
    while (!walk.endCondition(walk.currentNode)) {
        const currentMove = moveRule[currentRule];
        currentRule = (currentRule + 1) % moveRule.length;
        steps++;

        // console.log('currentRule', currentRule);
        // console.log('currentMove', currentMove);
        const node = networkNodes.find(
            (networkNode) => networkNode.name === walk.currentNode
        );
        if (!node) {
            throw new Error(`Node ${walk.currentNode} should be in network`);
        }

        walk.currentNode = node[currentMove];
    }

    // console.log('updated walk', walk);
    stepsByWalk.push(steps);
}

const overallSteps = lcm(stepsByWalk);
// console.log('finished walks', walks);
console.log('steps', overallSteps);
