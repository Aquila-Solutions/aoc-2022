import { CraneBase } from "./crane-base.js";

export class CrateMover9001 extends CraneBase {

    moveCrates(count: number, from: string, to: string): void {
        var fromStack = this.stacks[from];
        if (fromStack.length < count)
            throw new Error(`no crate left on stack ${from}`);

        var crates = fromStack.splice(fromStack.length - count, count);
        crates.forEach(x => this.stacks[to].push(x));
    }
}