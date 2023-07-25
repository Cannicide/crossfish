import { BaseAssertions, chalk } from "./base.js";

const color = chalk.bgGreen.blackBright;

export class StringAssertions extends BaseAssertions {

    constructor(name: string) {
        super(name);
    }

    /**
     * Asserts that the string is equal to the other given string, ignoring case.
     */
    equalsIgnoreCase(otherValue: string) {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} equal to value '${otherValue}'`,
            name: "Should Equal",
            color,
            expect: (value: string) => value.toLowerCase() == otherValue.toLowerCase()
        });

        return this;
    }

    /**
     * Asserts that the string is 'lowercase'.
     */
    isLowerCase() {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} lowercase`,
            name: "Should Be Lowercase",
            color,
            expect: (value: string) => value.toLowerCase() == value
        });

        return this;
    }

    /**
     * Asserts that the string is 'UPPERCASE'.
     */
    isUpperCase() {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} uppercase`,
            name: "Should Be Uppercase",
            color,
            expect: (value: string) => value.toUpperCase() == value
        });

        return this;
    }

    /**
     * Asserts that the string is 'Titlecase'.
     */
    isTitleCase() {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} titlecase`,
            name: "Should Be Titlecase",
            color,
            expect: (value: string) => value.slice(0).toUpperCase() + value.slice(1) == value
        });

        return this;
    }

    /**
     * Asserts that the string is the reverse of the other given string.
     * 
     * Note that this method intentionally avoids mutating the string and other given string, providing a fully-safe reversal check.
     */
    isReverseOf(otherValue: string) {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} the reverse of value '${otherValue}'`,
            name: "Should Be Reverse",
            color,
            expect: (value: string) => otherValue.split("").reverse().join("") == value
        });

        return this;
    }

    /**
     * Asserts that the string length is greater than the given length.
     */
    isGreaterThanLength(length: number) {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} greater than length ${length}`,
            name: "Should Be Greater",
            color,
            expect: (value: string) => value.length > length
        });

        return this;
    }

    /**
     * Asserts that the string length is less than the given length.
     */
    isLessThanLength(length: number) {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} less than length ${length}`,
            name: "Should Be Less",
            color,
            expect: (value: string) => value.length < length
        });

        return this;
    }

    /**
     * Asserts that the string length is greater than or equal to the given length.
     */
    isAtLeastLength(length: number) {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} greater than or equal to length ${length}`,
            name: "Should Be At Least",
            color,
            expect: (value: string) => value.length >= length
        });

        return this;
    }

    /**
     * Asserts that the string length is less than or equal to the given length.
     */
    isAtMostLength(length: number) {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} less than or equal to length ${length}`,
            name: "Should Be At Most",
            color,
            expect: (value: string) => value.length <= length
        });

        return this;
    }

    /**
     * Asserts that the string length is exactly the given length.
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
     * Asserts that the string is comprised solely of alphabetic characters (i.e. letters A-Z).
     * 
     * Note that there are some exceptions: '.', ' ', '-', and '_' are also accepted as alphabetic by this method.
     */
    isAlpha() {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} solely alphabetic characters`,
            name: "Should Be Alpha",
            color,
            expect: (value: string) => !value.match(/[^a-zA-Z. -_]/)
        });

        return this;
    }

    /**
     * Asserts that the string is comprised solely of numeric characters (i.e. numbers 0-9).
     * 
     * Note that there is an exception: '.' is also accepted as numeric by this method to support decimals.
     */
    isNumeric() {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} solely numeric characters`,
            name: "Should Be Numeric",
            color,
            expect: (value: string) => !value.match(/[^0-9.]/)
        });

        return this;
    }

    /**
     * Asserts that the string is comprised solely of alphanumeric characters (i.e. letters A-Z, numbers 0-9, '.', ' ', '-', and '_').
     */
    isAlphaNumeric() {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} solely alphanumeric characters`,
            name: "Should Be Alphanumeric",
            color,
            expect: (value: string) => !value.match(/[^0-9a-zA-Z. -_]/)
        });

        return this;
    }

    /**
     * Asserts that the string matches the given regular expression.
     */
    matches(regex: RegExp) {
        this.predicates.push({
            message: `Variable {name} unexpectedly did {NOT} match the provided regex`,
            name: "Should Match Regex",
            color,
            expect: (value: string) => !!value.match(regex)
        });

        return this;
    }

    /**
     * Asserts that the string is in basic email syntax.
     * 
     * Note that this method **does not** guarantee that the email is valid or existent.\
     * It is also recommended to use a library dedicated to syntax validation with `predicate()` instead, as seen in the example.
     * 
     * @example
     * // Recommended alternative to this method using a different dedicated library
     * 
     * import * as EmailValidator from 'email-validator';
     * const email = "test@email.com";
     * 
     * expect.string("Email Syntax Validation")
     * .predicate("Validator", EmailValidator.validate)
     * .assert("Email Variable", email); // Works, is valid email
     */
    isEmail() {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} in basic email syntax`,
            name: "Should Be Email",
            color,
            expect: (value: string) => !!value.match(/[^@]+\@[^@]+\.[^@+]/)
        });

        return this;
    }

    /**
     * Asserts that the string is trimmed (i.e. no whitespace at start or end).
     */
    isTrimmed() {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} trimmed of start/end whitespace characters`,
            name: "Should Be Trimmed",
            color,
            expect: (value: string) => value.trim() == value
        });

        return this;
    }

    /**
     * Asserts that the string has at least the given number of spaces. Defaults to `1`.
     */
    hasSpaces(minSpaces: number = 1) {
        this.predicates.push({
            message: `Variable {name} unexpectedly did {NOT} have at least ${minSpaces} spaces`,
            name: "Should Have Spaces",
            color,
            expect: (value: string) => (value.match(" ")?.length ?? 0) >= minSpaces
        });

        return this;
    }

    /**
     * Asserts that the string has exactly the given number of spaces.
     */
    hasSpacesExact(minSpaces: number) {
        this.predicates.push({
            message: `Variable {name} unexpectedly did {NOT} have ${minSpaces} spaces`,
            name: "Should Have Spaces",
            color,
            expect: (value: string) => (value.match(" ")?.length ?? 0) == minSpaces
        });

        return this;
    }

    /**
     * Asserts that the string has at least the given number of tabs. Defaults to `1`.
     */
    hasTabs(minTabs: number = 1) {
        this.predicates.push({
            message: `Variable {name} unexpectedly did {NOT} have at least ${minTabs} tabs`,
            name: "Should Have Tabs",
            color,
            expect: (value: string) => (value.match("\t")?.length ?? 0) >= minTabs
        });

        return this;
    }

    /**
     * Asserts that the string has exactly the given number of tabs.
     */
    hasTabsExact(tabs: number) {
        this.predicates.push({
            message: `Variable {name} unexpectedly did {NOT} have ${tabs} tabs`,
            name: "Should Have Tabs",
            color,
            expect: (value: string) => (value.match("\t")?.length ?? 0) == tabs
        });

        return this;
    }

    /**
     * Asserts that the string has at least the given number of lines.
     */
    hasLines(minLines: number) {
        this.predicates.push({
            message: `Variable {name} unexpectedly did {NOT} have at least ${minLines} lines`,
            name: "Should Have Lines",
            color,
            expect: (value: string) => (value.match("\n")?.length ?? 0) + 1 >= minLines
        });

        return this;
    }

    /**
     * Asserts that the string has exactly the given number of lines.
     */
    hasLinesExact(lines: number) {
        this.predicates.push({
            message: `Variable {name} unexpectedly did {NOT} have ${lines} lines`,
            name: "Should Have Lines",
            color,
            expect: (value: string) => (value.match("\n")?.length ?? 0) + 1 == lines
        });

        return this;
    }

    /**
     * Asserts that the string is multiline (i.e. has at least 2 lines).
     */
    isMultiline() {
        this.hasLines(2);
        this.predicates.at(-1)!.name = `Should Be Multiline`;

        return this;
    }

    /**
     * Asserts that the string is empty.
     */
    isEmpty() {
        this.predicates.push({
            message: `Variable {name} unexpectedly was {NOT} empty`,
            name: "Should Be Empty",
            color,
            expect: (value: string) => value == ""
        });

        return this;
    }

    predicate(name: string, predicate: (value: string) => boolean) {
        return super.predicate(name, predicate);
    }

    assert(variableName: string, value: string) {
        this.doesExist(); // Checks if variable exists
        this.predicates.at(-1)!.size = 0;

        this.isType("string"); // Checks if variable is string
        this.predicates.at(-1)!.size = 0;

        super.assert(variableName, value);
        this.predicates = this.predicates.slice(0, -2);
        return this;
    }

    refute(variableName: string, value: string) {
        this.predicates.push({
            message: "Variable {name} was unexpectedly NOT defined",
            name: "Should Exist",
            color: chalk.bgGray.whiteBright,
            size: 0,
            expect: (value: any) => (value ?? null) == null // Refutal inverts this; checks if variable DOES exist
        });
        this.predicates.push({
            message: `Variable {name} was unexpectedly NOT of type 'string'`,
            name: "Should Be Type",
            color: chalk.bgGray.whiteBright,
            size: 0,
            expect: (value: any) => typeof value !== "string" // Refutal inverts this; checks if variable IS string
        });

        super.refute(variableName, value);
        this.predicates = this.predicates.slice(0, -2);
        return this;
    }

}