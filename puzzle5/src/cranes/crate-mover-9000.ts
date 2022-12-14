import { CraneBase } from "./crane-base.js";

export class CrateMover9000 extends CraneBase {

    moveCrates(count: number, from: string, to: string): void {
        for (var c = 0; c < count; c++) {
            var crate = this.stacks[from].pop();
            if (crate) {
                this.stacks[to].push(crate);
            } else {
                throw new Error(`no crate left on stack ${from}`);
            }
        }
    }
}