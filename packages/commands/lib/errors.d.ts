import { Collection } from "discord.js";
export default class ErrorUtil {
    /**
     * Throws an error when a required variable has a falsy value (undefined, null, false).
     */
    static noexist(variable: any, message: string): void;
    /**
     * Throws an error when a variable is of a wrong or unexpected type.
     */
    static badtype(variable: any, type: string, descriptor: string): void;
    /**
     * Throws an error when a Collection already contains a key equal to the variable.
     */
    static isdupe(variable: any, collection: Collection<any, any> | Map<any, any>, descriptor: string): void;
    /**
     * Throws an error if two mutually exclusive variables are both defined and have a truthy value.
     */
    static exclusive(var1: any, var2: any, desc1: string, desc2: string): void;
    /**
     * Throws an error if the given predicate function returns true.
     */
    static pred(f: () => boolean | undefined, message: string): void;
    /**
     * Throws an error if slash command name validation -- which are used by the names of commands and their arguments -- fails.
     */
    static slashname(name: string | undefined, descriptor: string): void;
    /**
     * Throws an error if a value exceeds the provided minimum and maximum boundaries (both min and max are inclusive).
     */
    static minmax(value: number | undefined, descriptor: string, min: number, max: number): void;
    /**
     * Throws an error when a Collection does not contain a key equal to the variable.
     */
    static hasnot(variable: any, collection: Collection<any, any> | Map<any, any>, message: string): void;
}
