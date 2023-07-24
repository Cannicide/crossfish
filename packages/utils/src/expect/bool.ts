import { BaseAssertions, chalk } from "./base.js";

// TODO: change colors for all methods
export class BooleanAssertions extends BaseAssertions {

    constructor(name: string) {
        super(name);
    }

    isTrue() {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} true.`,
            name: "Should Be True",
            color: chalk.bgBlue.whiteBright,
            expect: (value: boolean) => !!value
        });

        return this;
    }

    isFalse() {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} false.`,
            name: "Should Be False",
            color: chalk.bgBlue.whiteBright,
            expect: (value: boolean) => !value
        });

        return this;
    }

    and(otherValue: boolean) {
        this.predicates.push({
            message: `Variable {name} AND another provided value was unexpectedly {NOT} evaluated to true.`,
            name: "Should Both True",
            color: chalk.bgBlue.whiteBright,
            expect: (value: boolean) => value && otherValue
        });

        return this;
    }

    or(otherValue: boolean) {
        this.predicates.push({
            message: `Variable {name} OR another provided value was unexpectedly {NOT} evaluated to true.`,
            name: "Should Any True",
            color: chalk.bgBlue.whiteBright,
            expect: (value: boolean) => value || otherValue
        });

        return this;
    }

    xor(otherValue: boolean) {
        this.predicates.push({
            message: `Variable {name} XOR another provided value was unexpectedly {NOT} evaluated to true.`,
            name: "Should Either True",
            color: chalk.bgBlue.whiteBright,
            expect: (value: boolean) => (!value && otherValue) || (value && !otherValue)
        });

        return this;
    }

    nor(otherValue: boolean) {
        this.predicates.push({
            message: `Variable {name} NOR another provided value was unexpectedly {NOT} evaluated to true.`,
            name: "Should Neither True",
            color: chalk.bgBlue.whiteBright,
            expect: (value: boolean) => !value && !otherValue
        });

        return this;
    }

    isInverseOf(otherValue: boolean) {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} the inverse of another provided value.`,
            name: "Should Be Inverse",
            color: chalk.bgBlue.whiteBright,
            expect: (value: boolean) => value == !otherValue
        });

        return this;
    }

    assert(variableName: string, value: boolean) {
        this.doesExist(); // Checks if variable exists
        this.isType("boolean"); // Checks if variable is boolean

        super.assert(variableName, value);
        this.predicates = this.predicates.slice(0, -2);
        return this;
    }

    refute(variableName: string, value: boolean) {
        this.predicates.push({
            message: "Variable {name} was unexpectedly NOT defined.",
            name: "Should Exist",
            color: chalk.bgGray.whiteBright,
            expect: (value: any) => (value ?? null) == null // Refutal inverts this; checks if variable DOES exist
        });
        this.predicates.push({
            message: `Variable {name} was unexpectedly NOT of type 'boolean'`,
            name: "Should Be Type",
            color: chalk.bgWhite.black,
            expect: (value: any) => typeof value !== "boolean" // Refutal inverts this; checks if variable IS bool
        });

        super.refute(variableName, value);
        this.predicates = this.predicates.slice(0, -2);
        return this;
    }

}