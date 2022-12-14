import { Stacks } from "../interfaces.js";

export abstract class CraneBase {
    private _stacks: Stacks = {};
    public set stacks(stacks: Stacks) { this._stacks = stacks; }
    public get stacks() { return this._stacks; }
    public abstract moveCrates(count: number, from: string, to: string): void;
}
