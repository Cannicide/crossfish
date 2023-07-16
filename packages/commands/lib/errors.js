export default class ErrorUtil {
    /**
     * Throws an error when a required variable has a falsy value (undefined, null, false).
     */
    static noexist(variable, message) {
        if (!variable)
            throw new Error("Crossfish Commands Error: " + message + ".");
    }
    /**
     * Throws an error when a variable is of a wrong or unexpected type.
     */
    static badtype(variable, type, descriptor) {
        if ((type == "array" && !Array.isArray(variable)) || (type != "array" && typeof variable !== type)) {
            throw new Error("Crossfish Commands Error: Invalid " + descriptor + ". Must be of type: " + type);
        }
    }
    /**
     * Throws an error when a Collection already contains a key equal to the variable.
     */
    static isdupe(variable, collection, descriptor) {
        if (collection.has(variable))
            throw new Error("Crossfish Commands Error: Cannot define duplicate " + descriptor + "s.");
    }
    /**
     * Throws an error if two mutually exclusive variables are both defined and have a truthy value.
     */
    static exclusive(var1, var2, desc1, desc2) {
        if (var1 && var2)
            throw new Error("Crossfish Commands Error: Properties '" + desc1 + "' and '" + desc2 + "' are mutually exclusive. Both cannot be defined at once.");
    }
    /**
     * Throws an error if the given predicate function returns true.
     */
    static pred(f, message) {
        if (f())
            throw new Error("Crossfish Commands Error: " + message + ".");
    }
    /**
     * Throws an error if slash command name validation -- which are used by the names of commands and their arguments -- fails.
     */
    static slashname(name, descriptor) {
        if (!name)
            return;
        // Official regex provided by Discord API, modified to allow space character
        if (!name.match(/^[-_ \p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/gu))
            throw new Error(`Crossfish Commands Error: Invalid ${descriptor} name '${name}'. These names can only contain '-', '_', and letters and numbers in any language.`);
        if (name.match(/[\p{Lu}]/gu))
            throw new Error(`Crossfish Commands Error: Invalid ${descriptor} name '${name}'. These names must be fully lowercase, except for letters in certain languages that do not have lowercase variants.`);
    }
    /**
     * Throws an error if a value exceeds the provided minimum and maximum boundaries (both min and max are inclusive).
     */
    static minmax(value, descriptor, min, max) {
        if (value == undefined)
            return;
        if (value < min)
            throw new Error(`Crossfish Commands Error: Value of property '${descriptor}' is below the minimum of ${min}.`);
        if (value > max)
            throw new Error(`Crossfish Commands Error: Value of property '${descriptor}' is above the maximum of ${max}.`);
    }
    /**
     * Throws an error when a Collection does not contain a key equal to the variable.
     */
    static hasnot(variable, collection, message) {
        if (!collection.has(variable))
            throw new Error("Crossfish Commands Error: " + message + ".");
    }
}
