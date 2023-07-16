import { PartialArgument, Argument } from "./types";
declare class CrossfishSyntax {
    static parseArgument(syntax: string): Argument[];
    static parseInnerArgument(arg: string): PartialArgument;
}
export default CrossfishSyntax;
