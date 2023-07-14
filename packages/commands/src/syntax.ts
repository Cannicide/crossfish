import ErrorUtil from "./errors";
import { ArgType } from "./enums";

interface PartialArgument {
    name: string;
    type: string;
    sub: boolean;
    choices?: any[];
    max?: number;
    min?: number;
    maxLength?: number;
    minLength?: number;
    autoComplete?: boolean;
}

interface Argument extends PartialArgument {
    subgroup?: boolean;
    subcommand?: boolean;
};

class CrossfishSyntax {
    
    static parseArgument(syntax: string) : Argument[] {
        let comps = syntax.split(/(?<!([<][^>]*)|([\[][^\]]*))\s+(?!([^<]*[>])|([^\[]*[\]]))/g); // Matches all spaces outside outermost  <> or [] brackets, supports inner > and <

        // Construct argument objects from syntax:

        let response = comps.filter(arg => arg !== undefined).map((arg, index) => {
            let result;

            ErrorUtil.pred(() => {
                return (arg.at(-1) == ">" && arg[0] != "<") ||
                (arg.at(-1) == "]" && arg[0] != "[") ||
                (arg.at(-1) != "]" && arg[0] == "[") ||
                (arg.at(-1) != ">" && arg[0] == "<");
            }, `Invalid argument segmentation in syntax: '${arg}'`);

            switch(arg[0]) {
                case "<":
                    // Required arg

                    result = {
                        ...this.parseInnerArgument(arg),
                        optional: false
                    };

                    break;
                case "[":
                    // Optional arg

                    result = {
                        ...this.parseInnerArgument(arg),
                        optional: true
                    };

                    break;
                default:
                    // Subgroup or subcommand

                    ErrorUtil.pred(() => index > 1, "Subgroups and subcommands can only be used as the first two arguments of a command");
                
                    result = {
                        name: arg.trim(),
                        sub: true,
                        optional: false
                    }
            }

            return result;
        });

        // Error checking:

        ErrorUtil.pred(() => response.length < 1, "Invalid command argument syntax.\nFailed to parse the following argument syntax:\n\n\t" + syntax);
        ErrorUtil.pred(() => response.length >= 2 && !response[0].sub && response[1].sub, "Cannot define a subcommand after an argument.\nFailed to parse the following argument syntax:\n\n\t" + syntax);
        
        // Identify subgroup and subcommand:

        if (response.filter(arg => arg.sub).length == 2) {
            response[0].subgroup = true;
            response[1].subcommand = true;
        }
        else if (response[0].sub) {
            response[0].subcommand = true;
        }

        return response;
    }

    static parseInnerArgument(arg: string) : PartialArgument {
        let result = {
            name: null,
            type: null,
            sub: false,
            choices: undefined,
            max: undefined,
            min: undefined,
            maxLength: undefined,
            minLength: undefined,
            autoComplete: false
        };

        let comps = arg.slice(1, -1).trim().split(":");
        result.name = comps[0].trim();

        if (result.name[0] == "*") {
            result.autoComplete = true;
            result.name = result.name.slice(1);
        }

        const data = comps[1]?.trim();
        if (data) {
            if (data.match(/\|/)) {
                // Choices specified

                result.choices = data.split(/\s*\|\s*/g); // Matches all pipe (|) characters and any connected whitespace characters
                ErrorUtil.pred(() => result.choices.length < 2, "At least two choices must be specified when using choices");

                if (result.choices.some(c => isNaN(c))) result.type = ArgType.String;
                else if (result.choices.every(c => Number.isInteger(Number(c)))) result.type = ArgType.Int;
                else result.type = ArgType.Float;
            }
            else if (data.match(/[<>]/)) {
                // Max or min or maxLength or minLength specified

                const isLength = data.match(/l/g);
                let minRegex, maxRegex;

                if (!isLength) {
                    minRegex = /x\s*>\s*(\d\.*\d*)|(\d\.*\d*)\s*<\s*x/g;
                    maxRegex = /x\s*<\s*(\d\.*\d*)|(\d\.*\d*)\s*>\s*x/g;
                }
                else {
                    minRegex = /l\s*>\s*(\d\.*\d*)|(\d\.*\d*)\s*<\s*l/g;
                    maxRegex = /l\s*<\s*(\d\.*\d*)|(\d\.*\d*)\s*>\s*l/g;
                }

                const min = Array.from(data.matchAll(minRegex), m => m[1] || m[2]);
                const max = Array.from(data.matchAll(maxRegex), m => m[1] || m[2]);
                ErrorUtil.pred(() => !min.length && !max.length, `Invalid inner argument syntax specified: '${arg}'`);

                if (!isLength) {
                    if (min.length) result.min = Math.max(...min.map(num => Number(num))); // Ex: x > 3 and x > 4 should cause min to be 4 (the max of the two)
                    if (max.length) result.max = Math.min(...max.map(num => Number(num))); // Ex: x < 3 and x < 4 should cause max to be 3 (the min of the two)

                    if (min.concat(max).every(c => !c.match(/\./))) result.type = ArgType.Int;
                    else result.type = ArgType.Float;
                }
                else {
                    if (min.length) result.minLength = Math.max(...min.map(num => Number(num))); // Ex: l > 3 and l > 4 should cause min to be 4 (the max of the two)
                    if (max.length) result.maxLength = Math.min(...max.map(num => Number(num))); // Ex: l < 3 and l < 4 should cause max to be 3 (the min of the two)

                    result.type = ArgType.String;
                }
            }
            else {
                // Datatype specified

                result.type = data;
            }
        }

        if (!result.type) result.type = ArgType.String;
        return result;
    }

}

export default CrossfishSyntax;