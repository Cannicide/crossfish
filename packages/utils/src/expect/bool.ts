import { BaseAssertions, chalk } from "./base.js";

const color = chalk.bgMagenta.blackBright;

export class BooleanAssertions extends BaseAssertions {

    constructor(name: string) {
        super(name);
    }

    /**
     * Asserts that the boolean is true.
     */
    isTrue() {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} true`,
            name: "Should Be True",
            color,
            expect: (value: boolean) => !!value
        });

        return this;
    }

    /**
     * Asserts that the boolean is false.
     */
    isFalse() {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} false`,
            name: "Should Be False",
            color,
            expect: (value: boolean) => !value
        });

        return this;
    }

    /**
     * Asserts that the boolean AND the other given boolean are both true.
     */
    and(otherValue: boolean) {
        this.predicates.push({
            message: `Variable {name} AND another provided value was unexpectedly {NOT} evaluated to true`,
            name: "Should Both True",
            color,
            expect: (value: boolean) => value && otherValue
        });

        return this;
    }

    /**
     * Asserts that the boolean OR the other given boolean are true.
     */
    or(otherValue: boolean) {
        this.predicates.push({
            message: `Variable {name} OR another provided value was unexpectedly {NOT} evaluated to true`,
            name: "Should Any True",
            color,
            expect: (value: boolean) => value || otherValue
        });

        return this;
    }

    /**
     * Asserts that ONLY ONE of either the boolean OR the other given boolean are true.
     */
    xor(otherValue: boolean) {
        this.predicates.push({
            message: `Variable {name} XOR another provided value was unexpectedly {NOT} evaluated to true`,
            name: "Should Either True",
            color,
            expect: (value: boolean) => (!value && otherValue) || (value && !otherValue)
        });

        return this;
    }

    /**
     * Asserts that NEITHER the boolean NOR the other given boolean are true.
     */
    nor(otherValue: boolean) {
        this.predicates.push({
            message: `Variable {name} NOR another provided value was unexpectedly {NOT} evaluated to true`,
            name: "Should Neither True",
            color,
            expect: (value: boolean) => !value && !otherValue
        });

        return this;
    }

    /**
     * Asserts that the boolean is the inverse of the other given boolean (i.e. `true` and `false`, `false` and `true`).
     */
    isInverseOf(otherValue: boolean) {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} the inverse of another provided value`,
            name: "Should Be Inverse",
            color,
            expect: (value: boolean) => value == !otherValue
        });

        return this;
    }
    
    predicate(name: string, predicate: (value: boolean) => boolean) {
        return super.predicate(name, predicate);
    }

    assert(variableName: string, value: boolean) {
        this.doesExist(); // Checks if variable exists
        this.predicates.at(-1)!.size = 0;

        this.isType("boolean"); // Checks if variable is boolean
        this.predicates.at(-1)!.size = 0;

        super.assert(variableName, value);
        this.predicates = this.predicates.slice(0, -2);
        return this;
    }

    refute(variableName: string, value: boolean) {
        this.predicates.push({
            message: "Variable {name} was unexpectedly NOT defined",
            name: "Should Exist",
            color: chalk.bgGray.whiteBright,
            size: 0,
            expect: (value: any) => (value ?? null) == null // Refutal inverts this; checks if variable DOES exist
        });
        this.predicates.push({
            message: `Variable {name} was unexpectedly NOT of type 'boolean'`,
            name: "Should Be Type",
            color: chalk.bgGray.whiteBright,
            size: 0,
            expect: (value: any) => typeof value !== "boolean" // Refutal inverts this; checks if variable IS bool
        });

        super.refute(variableName, value);
        this.predicates = this.predicates.slice(0, -2);
        return this;
    }

}