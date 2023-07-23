import chalk, { ChalkInstance } from "chalk";

export function assertionFailed({ message, name, color } : { message:string, name:string, color:ChalkInstance }, valName: string, varName: string, assertType: string) {
    const failureExplanation = message
                                .replace(/\{name\}/g, chalk.cyan(`'${valName.toUpperCase()} (${varName})'`))
                                .replace(/\{NOT\} /g, assertType == "Assert" ? "NOT " : "");

    const err = new Error(failureExplanation); // Thrown by expect(), powered by @crossfish/utils
    err.name = "    " + chalk.bgRedBright.bold(` Crossfish ${assertType} `) + " " + color.bold(` ${assertType == "Assert" ? name : name.replace(/Should/g, "Shouldn't")} `) + " ";
    err.message = chalk.redBright(failureExplanation);
    throw err;
}

export { chalk };

export class BaseAssertions {

    /**
     * @private
     */
    predicates = [] as ({
        message: string,
        name: string,
        color: ChalkInstance,
        expect: (value: any) => boolean
    })[];

    /**
     * @private
     */
    chalk = chalk;
    name: string;
    /**
     * @private
     */
    errorStatus?: string = undefined;

    constructor(name: string) {
        this.name = name; 
    }

    doesExist() {
        this.predicates.push({
            message: "Variable {name} was unexpectedly {NOT} defined.",
            name: "Should Exist",
            color: chalk.bgGray.whiteBright,
            expect: (value: any) => (value ?? null) !== null
        });

        return this;
    }

    isType(expectedType: string) {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} of type '${expectedType}'`,
            name: "Should Be Type",
            color: chalk.bgWhite.black,
            expect: (value: any) => typeof value == expectedType
        });

        return this;
    }

    isInstance(expectedClass: any) {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} an instance of the provided class`,
            name: "Should Be Instance",
            color: chalk.bgWhite.red,
            expect: (value: any) => value instanceof expectedClass
        });

        return this;
    }

    equals(otherValue: any) {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} equal to value '${otherValue}'`,
            name: "Should Equal",
            color: chalk.bgGray.redBright,
            expect: (value: any) => value == otherValue
        });

        return this;
    }

    equalsStrict(otherValue: any) {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} strictly equal to value '${otherValue}'`,
            name: "Should Equal (Strict)",
            color: chalk.bgGray.red,
            expect: (value: any) => value === otherValue
        });

        return this;
    }

    predicate(name: string, predicate: (value: any) => boolean) {
        this.predicates.push({
            message: `Variable {name} did {NOT} match the custom predicate '${name}'`,
            name: "Custom",
            color: chalk.bgGray.blue,
            expect: predicate
        });

        return this;
    }

    assert(variableName: string, value: any) {
        for (const predicate of this.predicates) {
            if (!predicate.expect(value)) {
                assertionFailed(predicate, this.name, variableName, "Assert");
                break;
            }
        }

        return this;
    }

    refute(variableName: string, value: any) {
        for (const predicate of this.predicates) {
            if (predicate.expect(value)) {
                assertionFailed(predicate, this.name, variableName, "Refute");
                break;
            }
        }

        return this;
    }
}