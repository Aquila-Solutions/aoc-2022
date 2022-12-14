import { createReadStream } from 'fs';
import { createInterface } from 'readline';
import minimist from 'minimist'
import { Stacks } from './interfaces.js';
import { CraneBase, CrateMover9000, CrateMover9001 } from './cranes/index.js';

const args = minimist(process.argv.slice(2));
const silent: boolean = !(/false/i).test(args['silent']);
const craneType = args['crane-type'] || 'CrateMover9001';
const file = args['file'];

if (!file) {
    throw new Error('--file argument not provided');
}

var reader = createInterface({ input: createReadStream(file) });
var init = true;
var setup: string[] = [];
var crane: CraneBase;

switch (craneType) {
    case 'CrateMover9000': crane = new CrateMover9000(); break;
    case 'CrateMover9001': crane = new CrateMover9001(); break;
    default: throw new Error(`Unknown crane type ${craneType}`);
}

function createStacks(): Stacks {
    var stacks: Stacks = {};
    var indices = setup.pop().split(' ').filter(x => !!x);
    for (const index of indices) {
        stacks[index] = [];
    }
    return stacks;
}

function initStacks(stacks: Stacks, line: string | undefined) {
    while (line) {
        var index = 1;
        while (line) {
            var crate = line.substring(0, 3);
            if (crate[0] == '[') stacks[index].push(crate);
            ++index;
            line = line.substring(4, line.length);
        }
        line = setup.pop();
    }
    return stacks;
}

function printState(state: string, stacks: Stacks) {
    console.log(`${state} state: {`);
    var keys = Object.keys(stacks);
    for (var key of keys) console.log(`${key}: [ ${stacks[key].join(' ')} ]`);
    console.log('}')
}

function printSolution(stacks: Stacks) {
    var keys = Object.keys(stacks);
    console.log(`solution: ${keys.map(x => stacks[x][stacks[x].length - 1][1]).join('')}`);
}

reader.on('line', function (line) {
    if (init) {
        if (line) {
            setup.push(line);
        } else {
            var stacks = initStacks(createStacks(), setup.pop());
            if (!silent) printState("initial", stacks);
            crane.stacks = stacks;
            init = !init;
        }
    } else {
        var moveRegex = /move\s(?<count>\d+)\sfrom\s(?<from>\d+)\sto\s(?<to>\d+)/;
        var match = moveRegex.exec(line);
        if (match) crane.moveCrates(Number.parseInt(match.groups['count']), match.groups['from'], match.groups['to']);
    }
})
reader.on('close', function () {
    var stacks = crane.stacks;
    if (!silent) printState("final", stacks);
    printSolution(stacks);
});
