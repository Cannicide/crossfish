import { Collection } from "discord.js";

// TODO: swap out this entire class with a more robust validator in @crossfish/utils
// (ex: validator.string.doesExist().isString().isGreaterThan(1).isLessThan(32).check("Test this")

export default class ErrorUtil {
    /**
     * Throws an error when a required variable has a falsy value (undefined, null, false).
     */
    static noexist(variable: any, message: string) {
        if (!variable) throw new Error("Crossfish Commands Error: " + message + ".");
    }
    
    /**
     * Throws an error when a variable is of a wrong or unexpected type.
     */
    static badtype(variable: any, type: string, descriptor: string) {
        if ((type == "array" && !Array.isArray(variable)) || (type != "array" && typeof variable !== type)) {
            throw new Error("Crossfish Commands Error: Invalid " + descriptor + ". Must be of type: " + type);
        }
    }

    /**
     * Throws an error when a Collection already contains a key equal to the variable.
     */
    static isdupe(variable: any, collection: Collection<any, any>|Map<any, any>, descriptor: string) {
        if (collection.has(variable)) throw new Error("Crossfish Commands Error: Cannot define duplicate " + descriptor + "s.");
    }

    /**
     * Throws an error if two mutually exclusive variables are both defined and have a truthy value.
     */
    static exclusive(var1: any, var2: any, desc1: string, desc2: string) {
        if (var1 && var2) throw new Error("Crossfish Commands Error: Properties '" + desc1 + "' and '" + desc2 + "' are mutually exclusive. Both cannot be defined at once.");
    }

    /**
     * Throws an error if the given predicate function returns true.
     */
    static pred(f: () => boolean|undefined, message: string) {
        if (f()) throw new Error("Crossfish Commands Error: " + message + ".");
    }

    /**
     * Throws an error if command name validation -- which are used by the names of slash/context commands and their arguments -- fails.
     */
    static badname(name: string|undefined, descriptor: string) {
        if (!name) return;

        // Official regex provided by Discord API, modified to allow space character
        if (!name.match(/^[-_ \p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/gu)) throw new Error(`Crossfish Commands Error: Invalid ${descriptor} name '${name}'. These names can only contain '-', '_', and letters and numbers in any language.`);
        if (descriptor !== "context menu" && name.match(/[\p{Lu}]/gu)) throw new Error(`Crossfish Commands Error: Invalid ${descriptor} name '${name}'. These names must be fully lowercase, except for letters in certain languages that do not have lowercase variants.`);
    }

    /**
     * Throws an error if a value exceeds the provided minimum and maximum boundaries (both min and max are inclusive).
     */
    static minmax(value: number|undefined, descriptor: string, min: number, max: number) {
        if (value == undefined) return;
        if (value < min) throw new Error(`Crossfish Commands Error: Value of property '${descriptor}' is below the minimum of ${min}.`);
        if (value > max) throw new Error(`Crossfish Commands Error: Value of property '${descriptor}' is above the maximum of ${max}.`);
    }

    /**
     * Throws an error when a Collection does not contain a key equal to the variable.
     */
    static hasnot(variable: any, collection: Collection<any, any>|Map<any, any>, message: string) {
        if (!collection.has(variable)) throw new Error("Crossfish Commands Error: " + message + ".");
    }
}