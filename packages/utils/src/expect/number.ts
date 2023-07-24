import { BaseAssertions, chalk } from "./base.js";

// TODO: change colors for all methods

export class NumberAssertions extends BaseAssertions {

    constructor(name: string) {
        super(name);
    }

    isGreaterThan(otherValue: number) {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} greater than ${otherValue}.`,
            name: "Should Be Greater",
            color: chalk.bgBlue.whiteBright,
            expect: (value: number) => value > otherValue
        });

        return this;
    }

    isLessThan(otherValue: number) {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} less than ${otherValue}.`,
            name: "Should Be Less",
            color: chalk.bgBlue.whiteBright,
            expect: (value: number) => value < otherValue
        });

        return this;
    }

    isAtLeast(otherValue: number) {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} greater than or equal to ${otherValue}.`,
            name: "Should Be At Least",
            color: chalk.bgBlue.whiteBright,
            expect: (value: number) => value >= otherValue
        });

        return this;
    }

    isAtMost(otherValue: number) {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} less than or equal to ${otherValue}.`,
            name: "Should Be At Most",
            color: chalk.bgBlue.whiteBright,
            expect: (value: number) => value <= otherValue
        });

        return this;
    }

    isEven() {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} even.`,
            name: "Should Be Even",
            color: chalk.bgBlue.whiteBright,
            expect: (value: number) => value % 2 == 0
        });

        return this;
    }

    isOdd() {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} odd.`,
            name: "Should Be Odd",
            color: chalk.bgBlue.whiteBright,
            expect: (value: number) => value % 2 != 0
        });

        return this;
    }

    isZero() {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} zero.`,
            name: "Should Be Zero",
            color: chalk.bgBlue.whiteBright,
            expect: (value: number) => value == 0
        });

        return this;
    }

    isFloat() {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} a float.`,
            name: "Should Be Float",
            color: chalk.bgBlue.whiteBright,
            expect: (value: number) => Math.floor(value) != value
        });

        return this;
    }

    isWhole() {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} a whole integer.`,
            name: "Should Be Whole",
            color: chalk.bgBlue.whiteBright,
            expect: (value: number) => Math.floor(value) == value
        });

        return this;
    }

    isPositive() {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} nonnegative.`,
            name: "Should Be Positive",
            color: chalk.bgBlue.whiteBright,
            expect: (value: number) => value >= 0
        });

        return this;
    }

    isNegative() {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} negative.`,
            name: "Should Be Negative",
            color: chalk.bgBlue.whiteBright,
            expect: (value: number) => value < 0
        });

        return this;
    }

    hasDigits(minDigits: number) {
        this.predicates.push({
            message: `Variable {name} unexpectedly did {NOT} have at least ${minDigits} digits.`,
            name: "Should Have Digits",
            color: chalk.bgBlue.whiteBright,
            expect: (value: number) => `${value}`.length >= minDigits
        });

        return this;
    }

    hasDigitsExact(digits: number) {
        this.predicates.push({
            message: `Variable {name} unexpectedly did {NOT} have ${digits} digits.`,
            name: "Should Have Digits",
            color: chalk.bgBlue.whiteBright,
            expect: (value: number) => `${value}`.length == digits
        });

        return this;
    }

    divisibleBy(divisor: number) {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} divisible by ${divisor}.`,
            name: "Should Be Divisible",
            color: chalk.bgBlue.whiteBright,
            expect: (value: number) => value % divisor == 0
        });

        return this;
    }

    canDivide(dividend: number) {
        this.predicates.push({
            message: `Variable {name} unexpectedly could {NOT} divide ${dividend}.`,
            name: "Should Divide",
            color: chalk.bgBlue.whiteBright,
            expect: (value: number) => dividend % value == 0
        });

        return this;
    }

    /**
     * Asserts that the number is a prime number.
     * 
     * ---
     * 
     * Derived from https://stackoverflow.com/a/40200710 \
     * With odd-optimizer by https://stackoverflow.com/users/251311/zerkms
     */
    isPrime() {
        this.predicates.push({
            message: ``,
            name: "",
            color: chalk,
            expect: (value: number) => {
                if (value % 2 == 0) return false;
                for (let i = 3, s = Math.sqrt(value); i <= s; i += 2) {
                    if (value % i == 0) return false;
                }
                return value > 1;
            }
        })
    }

    assert(variableName: string, value: number) {
        this.doesExist(); // Checks if variable exists
        this.isType("number"); // Checks if variable is number

        super.assert(variableName, value);
        this.predicates = this.predicates.slice(0, -2);
        return this;
    }

    refute(variableName: string, value: number) {
        this.predicates.push({
            message: "Variable {name} was unexpectedly NOT defined.",
            name: "Should Exist",
            color: chalk.bgGray.whiteBright,
            expect: (value: any) => (value ?? null) == null // Refutal inverts this; checks if variable DOES exist
        });
        this.predicates.push({
            message: `Variable {name} was unexpectedly NOT of type 'number'`,
            name: "Should Be Type",
            color: chalk.bgWhite.black,
            expect: (value: any) => typeof value !== "number" // Refutal inverts this; checks if variable IS number
        });

        super.refute(variableName, value);
        this.predicates = this.predicates.slice(0, -2);
        return this;
    }

}