import chalk, { ChalkInstance } from "chalk";
import util from "node:util";

export interface CrossfishError extends Error {
    crossfish: {
        name: string;
        variable: string;
        namespace: string;
        isAssert(): boolean;
        isRefute(): boolean;
        expectationNumber: number;
    };
}

export function assertionFailed({ message, name, color } : { message:string, name:string, color:ChalkInstance }, valName: string, varName: string, assertType: string, testNumber: number) {
    const failureExplanation = message
                                .replace(/\{name\}/g, chalk.cyan(`'${varName}'`))
                                .replace(/\{NOT\} /g, assertType == "Assert" ? "NOT " : "");

    const err = new Error(failureExplanation); // Powered by @crossfish/utils
    err.name = "    " + chalk.bgRedBright.bold(` Crossfish ${assertType} `) + " " + color.bold(` ${assertType == "Assert" ? name : name.replace(/Should/g, "Shouldn't")} `) + " ";
    err.message = chalk.redBright(failureExplanation) + chalk.gray(`\n    at expectation #${testNumber} of ${chalk.cyan(`'${valName.toUpperCase()}'`)}`);

    Object.defineProperty(err, "crossfish", {
        get() {
            return {
                name: name.toUpperCase(),
                variable: varName,
                namespace: valName,
                isAssert() { return assertType == "Assert"; },
                isRefute() { return assertType != "Assert"; },
                expectationNumber: testNumber
            };
        }
    });

    throw err as CrossfishError;
}

export { chalk };
const color = chalk.bgGray.whiteBright;

export class BaseAssertions {

    /**
     * @private
     */
    predicates = [] as ({
        message: string,
        name: string,
        color: ChalkInstance,
        size?: number,
        expect: (value: any) => boolean
    })[];

    /**
     * @private
     */
    chalk = chalk;
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    /**
     * Asserts that the value is defined (i.e. not `null` or `undefined`).
     */
    doesExist() {
        this.predicates.push({
            message: "Variable {name} was unexpectedly {NOT} defined",
            name: "Should Exist",
            color,
            expect: (value: any) => (value ?? null) !== null
        });

        return this;
    }

    /**
     * Asserts that the value is of the given type (e.g. "string", "number", etc).
     * 
     * Note that type assertions are automatically handled by type-specific assertion methods (e.g. `expect.string()`, `expect.bool()`, etc).
     */
    isType(expectedType: string) {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} of type '${expectedType}'`,
            name: "Should Be Type",
            color,
            expect: (value: any) => typeof value == expectedType
        });

        return this;
    }

    /**
     * Asserts that the value is an array.
     */
    isArray() {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} an array`,
            name: "Should Be Array",
            color,
            expect: (value: any) => Array.isArray(value)
        });

        return this;
    }

    /**
     * Asserts that the value is an instance of the given class.
     */
    isInstance(expectedClass: any) {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} an instance of the provided class`,
            name: "Should Be Instance",
            color,
            expect: (value: any) => value instanceof expectedClass
        });

        return this;
    }

    /**
     * Asserts that the value is leniently equal (`==`) to the other given value.
     * 
     * Note that this works best for primitive types; for Objects and Arrays, use `deepEqualsStrict()`.
     */
    equals(otherValue: any) {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} equal to value '${otherValue}'`,
            name: "Should Equal",
            color,
            expect: (value: any) => value == otherValue
        });

        return this;
    }

    /**
     * Asserts that the value is strictly equal (`===`) to the other given value.
     * 
     * Note that this works best for primitive types; for Objects and Arrays, use `deepEqualsStrict()`.
     */
    equalsStrict(otherValue: any) {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} strictly equal to value '${otherValue}'`,
            name: "Should Equal (Strict)",
            color,
            expect: (value: any) => value === otherValue
        });

        return this;
    }

    /**
     * Asserts that the value is strictly, deeply equal to the other given value based on Node's standards.
     */
    deepEqualsStrict(otherValue: any) {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} equal to value '${otherValue}'`,
            name: "Should Deep Equal",
            color,
            expect: (value: any) => util.isDeepStrictEqual(value, otherValue)
        });

        return this;
    }

    /**
     * Asserts that the value passes the given custom predicate function.
     * 
     * Note that this can be used for any assertions not explicitly covered by Crossfish Expect.
     */
    predicate(name: string, predicate: (value: any) => boolean) {
        this.predicates.push({
            message: `Variable {name} did {NOT} match the custom predicate '${name}'`,
            name: "Custom",
            color: chalk.bgGray.blueBright,
            expect: predicate
        });

        return this;
    }

    /**
     * Tests all provided expectations and assertions against the given variable value.\
     * If the value does not **PASS** all assertions, a descriptive error will be thrown.
     * 
     * @example
     * const firstName = "John";
     * const lastName = "Doe";
     * 
     * expect("Assert Test")
     * .equals("John")
     * .assert("First Name", firstName) // Works, as firstName == "John"
     * .assert("Last Name", lastName) // Errors, as lastName != "John"
     */
    assert(variableName: string, value: any) {
        let i = 0;
        for (const predicate of this.predicates) {
            i += predicate.size ?? 1;
            if (!predicate.expect(value)) {
                assertionFailed(predicate, this.name, variableName, "Assert", i);
                break;
            }
        }

        return this;
    }

    /**
     * Tests all provided expectations and assertions against the given variable value.\
     * If the value does not **FAIL** all assertions, a descriptive error will be thrown.
     * 
     * @example
     * const firstName = "Jane";
     * const lastName = "Doe";
     * 
     * expect("Refute Test")
     * .equals("Doe")
     * .refute("First Name", firstName) // Works, as firstName != "Doe"
     * .refute("Last Name", lastName) // Errors, as lastName == "Doe"
     */
    refute(variableName: string, value: any) {
        let i = 0;
        for (const predicate of this.predicates) {
            i += predicate.size ?? 1;
            if (predicate.expect(value)) {
                assertionFailed(predicate, this.name, variableName, "Refute", i);
                break;
            }
        }

        return this;
    }
}