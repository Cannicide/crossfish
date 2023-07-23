import { BaseAssertions, chalk } from "./base.js";

export class StringAssertions extends BaseAssertions {

    constructor(name: string) {
        super(name);
    }

    equalsIgnoreCase(otherValue: string) {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} equal to value '${otherValue}'.`,
            name: "Should Equal",
            color: chalk.bgGray.greenBright,
            expect: (value: string) => value.toLowerCase() == otherValue.toLowerCase()
        });

        return this;
    }

    isLowerCase() {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} lowercase.`,
            name: "Should Be Lowercase",
            color: chalk.bgBlue.whiteBright,
            expect: (value: string) => value.toLowerCase() == value
        });

        return this;
    }

    isUpperCase() {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} uppercase.`,
            name: "Should Be Uppercase",
            color: chalk.bgBlue.whiteBright,
            expect: (value: string) => value.toUpperCase() == value
        });

        return this;
    }

    isTitleCase() {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} titlecase.`,
            name: "Should Be Titlecase",
            color: chalk.bgBlue.whiteBright,
            expect: (value: string) => value.slice(0).toUpperCase() + value.slice(1) == value
        });

        return this;
    }

    isReverseOf(otherValue: string) {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} the reverse of value '${otherValue}'.`,
            name: "Should Be Reverse",
            color: chalk.bgWhite.cyanBright,
            expect: (value: string) => otherValue.split("").reverse().join("") == value
        });

        return this;
    }

    isGreaterThanLength(length: number) {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} greater than length ${length}.`,
            name: "Should Be Greater",
            color: chalk.bgGreen.whiteBright,
            expect: (value: string) => value.length > length
        });

        return this;
    }

    isLessThanLength(length: number) {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} less than length ${length}.`,
            name: "Should Be Less",
            color: chalk.bgGreen.whiteBright,
            expect: (value: string) => value.length < length
        });

        return this;
    }

    isAtLeastLength(length: number) {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} greater than or equal to length ${length}.`,
            name: "Should Be At Least",
            color: chalk.bgGreen.whiteBright,
            expect: (value: string) => value.length >= length
        });

        return this;
    }

    isAtMostLength(length: number) {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} less than or equal to length ${length}.`,
            name: "Should Be At Most",
            color: chalk.bgGreen.whiteBright,
            expect: (value: string) => value.length <= length
        });

        return this;
    }

    isAlpha() {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} solely alphabet characters.`,
            name: "Should Be Alpha",
            color: chalk.bgMagenta.whiteBright,
            expect: (value: string) => !value.match(/[^a-zA-Z. -_]/)
        });

        return this;
    }

    isNumeric() {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} solely numeric characters.`,
            name: "Should Be Numeric",
            color: chalk.bgMagenta.whiteBright,
            expect: (value: string) => !value.match(/[^0-9.]/)
        });

        return this;
    }

    isAlphaNumeric() {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} solely alphanumeric characters.`,
            name: "Should Be Alphanumeric",
            color: chalk.bgMagenta.whiteBright,
            expect: (value: string) => !value.match(/[^0-9.a-zA-Z. -_]/)
        });

        return this;
    }

    matches(regex: RegExp) {
        this.predicates.push({
            message: `Variable {name} unexpectedly did {NOT} match the provided regex.`,
            name: "Should Match Regex",
            color: chalk.bgCyan.whiteBright,
            expect: (value: string) => !!value.match(regex)
        });

        return this;
    }

    isEmail() {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} in basic email syntax.`,
            name: "Should Be Email",
            color: chalk.bgYellow.blackBright,
            expect: (value: string) => !!value.match(/[^@]+\@[^@]+\.[^@+]/)
        });

        return this;
    }

    isTrimmed() {
        this.predicates.push({
            message: `Variable {name} was unexpectedly {NOT} trimmed of start/end whitespace characters.`,
            name: "Should Be Trimmed",
            color: chalk.bgBlack.whiteBright,
            expect: (value: string) => value.trim() == value
        });

        return this;
    }

    hasSpaces(minSpaces: number = 1) {
        this.predicates.push({
            message: `Variable {name} unexpectedly did {NOT} have at least ${minSpaces} spaces.`,
            name: "Should Have Spaces",
            color: chalk.bgBlack.cyanBright,
            expect: (value: string) => (value.match(" ")?.length ?? 0) >= minSpaces
        });

        return this;
    }

    hasSpacesExact(minSpaces: number) {
        this.predicates.push({
            message: `Variable {name} unexpectedly did {NOT} have ${minSpaces} spaces.`,
            name: "Should Have Spaces",
            color: chalk.bgBlack.cyanBright,
            expect: (value: string) => (value.match(" ")?.length ?? 0) == minSpaces
        });

        return this;
    }

    hasTabs(minTabs: number = 1) {
        this.predicates.push({
            message: `Variable {name} unexpectedly did {NOT} have at least ${minTabs} tabs.`,
            name: "Should Have Tabs",
            color: chalk.bgBlack.yellowBright,
            expect: (value: string) => (value.match("\t")?.length ?? 0) >= minTabs
        });

        return this;
    }

    hasTabsExact(tabs: number) {
        this.predicates.push({
            message: `Variable {name} unexpectedly did {NOT} have ${tabs} tabs.`,
            name: "Should Have Tabs",
            color: chalk.bgBlack.yellowBright,
            expect: (value: string) => (value.match("\t")?.length ?? 0) == tabs
        });

        return this;
    }

    hasLines(minLines: number, multiLineCheck?: string) {
        this.predicates.push({
            message: `Variable {name} unexpectedly did {NOT} have at least ${minLines} lines.`,
            name: multiLineCheck ?? "Should Have Lines",
            color: chalk.bgBlack.greenBright,
            expect: (value: string) => (value.match("\n")?.length ?? 0) + 1 >= minLines
        });

        return this;
    }

    hasLinesExact(lines: number, multiLineCheck?: string) {
        this.predicates.push({
            message: `Variable {name} unexpectedly did {NOT} have ${lines} lines.`,
            name: multiLineCheck ?? "Should Have Lines",
            color: chalk.bgBlack.greenBright,
            expect: (value: string) => (value.match("\n")?.length ?? 0) + 1 == lines
        });

        return this;
    }

    isMultiline() {
        return this.hasLines(2, "Should Be Multiline");
    }

    isEmpty() {
        this.predicates.push({
            message: `Variable {name} unexpectedly was {NOT} empty.`,
            name: "Should Be Empty",
            color: chalk.bgBlack.magentaBright,
            expect: (value: string) => value == ""
        });

        return this;
    }

    assert(variableName: string, value: string) {
        this.doesExist(); // Checks if variable exists
        this.isType("string"); // Checks if variable is string

        super.assert(variableName, value);
        this.predicates = this.predicates.slice(0, -2);
        return this;
    }

    refute(variableName: string, value: string) {
        this.predicates.push({
            message: "Variable {name} was unexpectedly NOT defined.",
            name: "Should Exist",
            color: chalk.bgGray.whiteBright,
            expect: (value: any) => (value ?? null) == null // Refutal inverts this; checks if variable DOES exist
        });
        this.predicates.push({
            message: `Variable {name} was unexpectedly NOT of type 'string'`,
            name: "Should Be Type",
            color: chalk.bgWhite.black,
            expect: (value: any) => typeof value !== "string" // Refutal inverts this; checks if variable IS string
        });

        super.refute(variableName, value);
        this.predicates = this.predicates.slice(0, -2);
        return this;
    }

}