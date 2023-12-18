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

const enterNode = 'AAA';
const exitNode = 'ZZZ';
let currentNode = enterNode;
let steps = 0;
let currentRule = 0;
while (currentNode !== exitNode) {
    const node = networkNodes.find(
        (networkNode) => networkNode.name === currentNode
    );
    if (!node) {
        throw new Error(`Node ${currentNode} should be in network`);
    }

    const currentMove = moveRule[currentRule];
    currentRule = (currentRule + 1) % moveRule.length;
    steps++;
    //
    // console.log('currentRule', currentRule);
    // console.log('currentMove', currentMove);

    currentNode = node[currentMove];
}

console.log('steps', steps);
