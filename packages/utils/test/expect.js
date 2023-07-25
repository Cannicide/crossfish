import { expect } from "../lib/index.js";
const chalk = expect(undefined).chalk;

// Test values for assertions:
// (For testing purposes these are named by their order of use)

const val1 = "some value";
const val2 = "another value";
const val3 = false;
const val4 = 456;
const val5 = 13;
const val6 = 7919;
const val7 = -17;
const val8 = [ "PEACH", "PEAR", "APPLE", "APPLE" ];

// Base assertions:

expect("Base Tests")
    .doesExist()
    .isType("string")
    .equalsStrict("some value")
    .predicate("Regex", v => v.match(/e value/))
    .assert("Val 1", val1); // Doesn't error for any assertion

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
    .assert("Val 2", val2)
    .refute("Val 1", val1);

expect.string("String Type Tests")
    .assert("Val 1", val1) // Doesn't error
    // .refute("Val 2", null) // Does error, as 'null' is not defined
    // .assert("Val 4", val4); // Does error, as '456' is not a string

expect.string("Email Syntax Validation")
    .isEmail()
    // .assert("Email", "john.doe@gmail.") // Does error
    // .assert("Email 2", "tom@doe@.com") // Does error
    .assert("Email 3", "jane_doe@gmail.com"); // Doesn't error

// Bool assertions:

expect.bool("Boolean Tests")
    // .isTrue() // Does error
    .isFalse() // Doesn't error
    // .and(true) // Does error
    .or(true) // Doesn't error
    // .xor(false) // Does error
    .nor(false) // Doesn't error
    // .isInverseOf(false) // Does error
    .assert("Val 3", val3);

// Number assertions:

expect.number("Number Tests")
    .canDivide(456 * 2) // Doesn't error
    .divisibleBy(3) // Doesn't error
    .hasDigits(2) // Doesn't error
    .hasDigitsExact(3) // Doesn't error
    // .isAtLeast(501) // Does error
    .isAtMost(1056) // Doesn't error
    .isEven() // Doesn't error
    // .isFloat() // Does error
    .isGreaterThan(1) // Doesn't error
    // .isLessThan(32) // Does error
    // .isNegative() // Does error
    // .isOdd() // Does error
    .isPositive() // Doesn't error
    .isWhole() // Doesn't error
    // .isZero() // Does error
    .assert("Val 4", val4);

expect.number("Prime Number Tests")
    .isPrime()
    // .assert("Val 4", val4) // Does error
    .assert("Val 5", val5) // Doesn't error
    .assert("Val 6", val6) // Doesn't error
    .refute("Val 7", val7); // Doesn't error

// Array assertions:

expect.array("Array Tests")
    .containsAt(1, "PEAR") // Doesn't error
    .containsEvery("PEAR", "APPLE")  // Doesn't error
    // .containsOnce("APPLE") // Does error
    .containsSome("APPLE", "CARROT")  // Doesn't error
    .includes("PEACH")  // Doesn't error
    .isArrayOfType("string")  // Doesn't error
    .isAtLeastLength(1)  // Doesn't error
    .isAtMostLength(4)  // Doesn't error
    // .isEmpty() // Does error
    .isGreaterThanLength(0)  // Doesn't error
    .isLessThanLength(5)  // Doesn't error
    // .isLength(3) // Does error
    // .isReverseOf([ "PEAR", "APPLE", "PEACH" ]) // Does error
    .isReverseOf(val8.slice(0).reverse()) // Doesn't error
    .predicate("<APPLE> Sort", arr => arr.sort().at(0) == "APPLE") // Doesn't error
    .predicateEvery("<E> Match Every", item => item.match("E")) // Doesn't error
    .predicateSome("<PE> Match Some", item => item.match("PE")) // Doesn't error
    // .predicateOnce("<A> Match Once", item => item.startsWith("A")) // Does error
    .assert("Val 8", val8);

// After all error check assertions, print if no errors:

console.log(chalk.greenBright("No errors!\nEverything is working, as all error-causing assertions should be commented out!"));