import { expect } from "../lib/index.js";
const chalk = expect(undefined).chalk;

const val1 = "some value";
const val2 = "another value";
const val3 = false;

// Base assertions:

expect("Base Tests")
    .doesExist()
    .isType("string")
    .equalsStrict("some value")
    .predicate("regex", v => v.match(/e value/))
    .assert("Val1", val1); // Doesn't error for any assertion

// String assertions:

expect.string("String Tests")
    .equals("another value") // Doesn't error for val1 or val2
    .equalsIgnoreCase("ANOTHER value") // Doesn't error for val1 or val2
    // .hasLines(1) // Does error for val1
    // .hasSpaces(1) // Does error for val1
    // .hasTabs(0) // Does error for val1
    // .isAlpha() // Does error for val1
    // .isAlphaNumeric() // Does error for val1
    // .isAtLeastLength(1) // Does error for val1
    // .isAtMostLength(32) // Does error for val1
    // .isGreaterThanLength(0) // Does error for val1
    // .isLessThanLength(33) // Does error for val1
    // .isLowerCase() // Does error for val1
    // .isMultiline() // Does error for val2
    // .isNumeric() // Does error for val2
    .isReverseOf("eulav rehtona") // Doesn't error for val1 or val2
    // .isTitleCase() // Does error for val2
    // .isTrimmed() // Does error for val1
    // .isUpperCase() // Does error for val2s
    .matches(/[a-zA-Z ]{13}/) // Doesn't error for val1 or val2
    .assert("Val2", val2)
    .refute("Val1", val1);

expect.string("String Type Tests")
    .assert("Val1", val1) // Doesn't error
    // .refute("Val2", null) // Does error, as 'null' is not defined
    // .assert("Val3", 456); // Does error, as '456' is not a string

// Bool assertions:

expect.bool("Boolean Tests")
    // .isTrue() // Does error
    .isFalse() // Doesn't error
    // .and(true) // Does error
    .or(true) // Doesn't error
    // .xor(false) // Does error
    .nor(false) // Doesn't error
    // .isInverseOf(false) // Does error
    .assert("Val3", val3);

// After all error check assertions, print if no errors:

console.log(chalk.greenBright("No errors!\nEverything is working, as all error-causing assertions should be commented out!"));