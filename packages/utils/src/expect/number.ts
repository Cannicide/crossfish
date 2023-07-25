import { BaseAssertions, chalk } from "./base.js";

const color = chalk.bgYellow.blackBright;

export class NumberAssertions extends BaseAssertions {

    constructor(name: string) {
        super(name);
    }

    /**
     * Asserts that the number is greater than the other given number.
     */
    isGreaterThan(otherValue: number) {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} greater than ${otherValue}`,
            name: "Should Be Greater",
            color,
            expect: (value: number) => value > otherValue
        });

        return this;
    }

    /**
     * Asserts that the number is less than the other given number.
     */
    isLessThan(otherValue: number) {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} less than ${otherValue}`,
            name: "Should Be Less",
            color,
            expect: (value: number) => value < otherValue
        });

        return this;
    }

    /**
     * Asserts that the number is greater than or equal to the other given number.
     */
    isAtLeast(otherValue: number) {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} greater than or equal to ${otherValue}`,
            name: "Should Be At Least",
            color,
            expect: (value: number) => value >= otherValue
        });

        return this;
    }

    /**
     * Asserts that the number is less than or equal to the other given number.
     */
    isAtMost(otherValue: number) {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} less than or equal to ${otherValue}`,
            name: "Should Be At Most",
            color,
            expect: (value: number) => value <= otherValue
        });

        return this;
    }

    /**
     * Asserts that the number is even (i.e. divisible by 2).
     */
    isEven() {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} even`,
            name: "Should Be Even",
            color,
            expect: (value: number) => value % 2 == 0
        });

        return this;
    }

    /**
     * Asserts that the number is odd (i.e. not divisible by 2).
     */
    isOdd() {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} odd`,
            name: "Should Be Odd",
            color,
            expect: (value: number) => value % 2 != 0
        });

        return this;
    }

    /**
     * Asserts that the number is exactly zero.
     */
    isZero() {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} zero`,
            name: "Should Be Zero",
            color,
            expect: (value: number) => value == 0
        });

        return this;
    }

    /**
     * Asserts that the number is a float (i.e. has a decimal).
     */
    isFloat() {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} a float`,
            name: "Should Be Float",
            color,
            expect: (value: number) => Math.floor(value) != value
        });

        return this;
    }

    /**
     * Asserts that the number is whole (i.e. does not have a decimal).
     */
    isWhole() {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} a whole integer`,
            name: "Should Be Whole",
            color,
            expect: (value: number) => Math.floor(value) == value
        });

        return this;
    }

    /**
     * Asserts that the number is positive (i.e. greater than zero).
     */
    isPositive() {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} positive`,
            name: "Should Be Positive",
            color,
            expect: (value: number) => value > 0
        });

        return this;
    }

    /**
     * Asserts that the number is negative (i.e. less than zero).
     */
    isNegative() {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} negative`,
            name: "Should Be Negative",
            color,
            expect: (value: number) => value < 0
        });

        return this;
    }

    /**
     * Asserts that the number is non-negative (i.e. greater than or equal to zero).
     */
    isNonNegative() {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} non-negative`,
            name: "Should Be Non-Negative",
            color,
            expect: (value: number) => value >= 0
        });

        return this;
    }

    /**
     * Asserts that the number has at least the given digit count.
     */
    hasDigits(minDigits: number) {
        this.predicates.push({
            message: `Variable {name} unexpectedly did {NOT} have at least ${minDigits} digits`,
            name: "Should Have Digits",
            color,
            expect: (value: number) => `${value}`.length >= minDigits
        });

        return this;
    }

    /**
     * Asserts that the number has exactly the given digit count.
     */
    hasDigitsExact(digits: number) {
        this.predicates.push({
            message: `Variable {name} unexpectedly did {NOT} have ${digits} digits`,
            name: "Should Have Digits",
            color,
            expect: (value: number) => `${value}`.length == digits
        });

        return this;
    }

    /**
     * Asserts that the number is divisible by the other given number (i.e. x modulo y).
     */
    divisibleBy(divisor: number) {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} divisible by ${divisor}`,
            name: "Should Be Divisible",
            color,
            expect: (value: number) => value % divisor == 0
        });

        return this;
    }

    /**
     * Asserts that the number can evenly divide the other given number (i.e. y modulo x).
     */
    canDivide(dividend: number) {
        this.predicates.push({
            message: `Variable {name} unexpectedly could {NOT} divide ${dividend}`,
            name: "Should Divide",
            color,
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
     * 
     * ---
     * 
     * Note that due to the looping nature of this solution,
     * it is not recommended to use this with immensely large numbers in the millions and beyond if every millisecond of execution speed is crucial to your program.
     */
    isPrime() {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} a prime number`,
            name: "Should Be Prime",
            color,
            expect: (value: number) => {
                if (value % 2 == 0) return false;
                for (let i = 3, s = Math.sqrt(value); i <= s; i += 2) {
                    if (value % i == 0) return false;
                }
                return value > 1;
            }
        });

        return this;
    }

    predicate(name: string, predicate: (value: number) => boolean) {
        return super.predicate(name, predicate);
    }

    assert(variableName: string, value: number) {
        this.doesExist(); // Checks if variable exists
        this.predicates.at(-1)!.size = 0;

        this.isType("number"); // Checks if variable is number
        this.predicates.at(-1)!.size = 0;

        super.assert(variableName, value);
        this.predicates = this.predicates.slice(0, -2);
        return this;
    }

    refute(variableName: string, value: number) {
        this.predicates.push({
            message: "Variable {name} was unexpectedly NOT defined",
            name: "Should Exist",
            color: chalk.bgGray.whiteBright,
            size: 0,
            expect: (value: any) => (value ?? null) == null // Refutal inverts this; checks if variable DOES exist
        });
        this.predicates.push({
            message: `Variable {name} was unexpectedly NOT of type 'number'`,
            name: "Should Be Type",
            color: chalk.bgGray.whiteBright,
            size: 0,
            expect: (value: any) => typeof value !== "number" // Refutal inverts this; checks if variable IS number
        });

        super.refute(variableName, value);
        this.predicates = this.predicates.slice(0, -2);
        return this;
    }

}