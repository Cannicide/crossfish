import { BaseAssertions, chalk } from "./base.js";
import util from "node:util";

const color = chalk.bgBlue.blackBright;

export class ArrayAssertions extends BaseAssertions {

    constructor(name: string) {
        super(name);
    }

    /**
     * Asserts that the array is greater than the given length.
     */
    isGreaterThanLength(length: number) {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} greater than length ${length}`,
            name: "Should Be Greater",
            color,
            expect: (value: any[]) => value.length > length
        });

        return this;
    }

    /**
     * Asserts that the array is less than the given length.
     */
    isLessThanLength(length: number) {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} less than length ${length}`,
            name: "Should Be Less",
            color,
            expect: (value: any[]) => value.length < length
        });

        return this;
    }

    /**
     * Asserts that the array is greater than or equal to the given length.
     */
    isAtLeastLength(length: number) {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} greater than or equal to length ${length}`,
            name: "Should Be At Least",
            color,
            expect: (value: any[]) => value.length >= length
        });

        return this;
    }

    /**
     * Asserts that the array is less than or equal to the given length.
     */
    isAtMostLength(length: number) {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} less than or equal to length ${length}`,
            name: "Should Be At Most",
            color,
            expect: (value: any[]) => value.length <= length
        });

        return this;
    }

    /**
     * Asserts that the array is exactly the given length.
     */
    isLength(length: number) {
        this.isAtLeastLength(length);
        this.predicates.at(-1)!.message = `Variable {name} was unexpectedly {NOT} equal to length ${length}`;
        this.predicates.at(-1)!.name = `Should Be Length`;

        this.isAtMostLength(length);
        this.predicates.at(-1)!.message = `Variable {name} was unexpectedly {NOT} equal to length ${length}`;
        this.predicates.at(-1)!.name = `Should Be Length`;
        this.predicates.at(-1)!.size = 0;

        return this;
    }

    /**
     * Asserts that the array includes the given item, starting from either the beginning of the array or from a custom index.
     */
    includes(innerItem: any, fromIndex?: number) {
        this.predicates.push({
            message: `Variable {name} unexpectedly did {NOT} include the provided value`,
            name: "Should Include",
            color,
            expect: (value: any[]) => value.includes(innerItem, fromIndex)
        });

        return this;
    }

    /**
     * Asserts that the array contains all of the given item(s).
     */
    containsEvery(...innerItems: any[]) {
        this.predicates.push({
            message: `Variable {name} unexpectedly did {NOT} contain all of the provided value(s)`,
            name: "Should Contain Every",
            color,
            expect: (value: any[]) => innerItems.every(innerItem => value.includes(innerItem))
        });

        return this;
    }

    /**
     * Asserts that the array contains some of the given item(s).
     */
    containsSome(...innerItems: any[]) {
        this.predicates.push({
            message: `Variable {name} unexpectedly did {NOT} contain at least one of the provided value(s)`,
            name: "Should Contain Some",
            color,
            expect: (value: any[]) => innerItems.some(innerItem => value.includes(innerItem))
        });

        return this;
    }

    /**
     * Asserts that the array contains only one of the given item, with no repeats.
     */
    containsOnce(innerItem: any) {
        this.predicates.push({
            message: `Variable {name} unexpectedly did {NOT} contain one of the provided value`,
            name: "Should Contain Once",
            color,
            expect: (value: any[]) => value.indexOf(innerItem) != -1 && value.indexOf(innerItem) == value.lastIndexOf(innerItem)
        });

        return this;
    }

    /**
     * Asserts that the array contains the given item at the given index.
     */
    containsAt(index: number, innerItem: any) {
        this.predicates.push({
            message: `Variable {name} unexpectedly did {NOT} contain the provided value at index ${index}`,
            name: "Should Contain At",
            color,
            expect: (value: any[]) => value.length > index && value.at(index) == innerItem
        });

        return this;
    }

    /**
     * Asserts that the array contains only items of the given type (e.g. array of strings).
     */
    isArrayOfType(type: string) {
        this.predicates.push({
            message: `Variable {name} unexpectedly was {NOT} solely an array of '${type}'`,
            name: "Should Be Array Type",
            color,
            expect: (value: any[]) => value.every(item => typeof item === type)
        });
        
        return this;
    }

    /**
     * Asserts that the array is strictly, deeply equal to the other given value based on Node's standards.
     */
    deepEqualsStrict(otherValue: any[]) {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} equal to the other provided array`,
            name: "Should Equal Array",
            color,
            expect: (value: any[]) => util.isDeepStrictEqual(value, otherValue)
        });

        return this;
    }

    /**
     * Asserts that the array is strictly, deeply equal to the other given value based on Node's standards.
     * 
     * Note that this is overridden in `expect.array()` to use `deepEqualsStrict()`. Using either method will work.
     */
    equals(otherValue: any[]) {
        return this.deepEqualsStrict(otherValue);
    }

    /**
     * Asserts that the array is the reverse of the other given array.
     * 
     * Note that this method intentionally avoids mutating the array and other given array, providing a fully-safe reversal check.
     */
    isReverseOf(otherValue: any[]) {
        this.equals(otherValue.slice().reverse());
        this.predicates.at(-1)!.message = `Variable {name} was unexpectedly {NOT} the reverse of the other provided array`;
        this.predicates.at(-1)!.name = "Should Be Reverse";

        return this;
    }

    /**
     * Asserts that the array is empty.
     */
    isEmpty() {
        this.isLength(0);
        this.predicates.at(-1)!.message = `Variable {name} was unexpectedly {NOT} empty`;
        this.predicates.at(-1)!.name = `Should Be Empty`;
        this.predicates.at(-2)!.message = `Variable {name} was unexpectedly {NOT} empty`;
        this.predicates.at(-2)!.name = `Should Be Empty`;

        return this;
    }

    predicate(name: string, predicate: (value: any[]) => boolean) {
        return super.predicate(name, predicate);
    }

    /**
     * Asserts that all of the items in the array pass the given custom predicate function.
     * 
     * Note that this predicate is used on each individual item of the array, whereas `predicate()` is used on the array itself.
     */
    predicateEvery(name: string, predicate: (value: any) => boolean) {
        return this.predicate(name, (value) => value.every(item => predicate(item)));
    }

    /**
     * Asserts that some of the items in the array pass the given custom predicate function.
     * 
     * Note that this predicate is used on each individual item of the array, whereas `predicate()` is used on the array itself.
     */
    predicateSome(name: string, predicate: (value: any) => boolean) {
        return this.predicate(name, (value) => value.some(item => predicate(item)));
    }

    /**
     * Asserts that only one of the items in the array pass the given custom predicate function.
     * 
     * Note that this predicate is used on each individual item of the array, whereas `predicate()` is used on the array itself.
     */
    predicateOnce(name: string, predicate: (value: any) => boolean) {
        return this.predicate(name, (value) => value.filter(item => predicate(item)).length == 1);
    }

    assert(variableName: string, value: any[]) {
        this.doesExist(); // Checks if variable exists
        this.predicates.at(-1)!.size = 0;

        this.isArray(); // Checks if variable is array
        this.predicates.at(-1)!.size = 0;

        super.assert(variableName, value);
        this.predicates = this.predicates.slice(0, -2);
        return this;
    }

    refute(variableName: string, value: any[]) {
        this.predicates.push({
            message: "Variable {name} was unexpectedly NOT defined",
            name: "Should Exist",
            color: chalk.bgGray.whiteBright,
            size: 0,
            expect: (value: any) => (value ?? null) == null // Refutal inverts this; checks if variable DOES exist
        });
        this.predicates.push({
            message: `Variable {name} was unexpectedly NOT an array`,
            name: "Should Be Array",
            color: chalk.bgGray.whiteBright,
            size: 0,
            expect: (value: any) => !Array.isArray(value) // Refutal inverts this; checks if variable IS array
        });

        super.refute(variableName, value);
        this.predicates = this.predicates.slice(0, -2);
        return this;
    }

}