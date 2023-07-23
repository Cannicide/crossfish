import { BaseAssertions } from "./base.js";
import { StringAssertions } from "./string.js";
import { BooleanAssertions } from "./bool.js";

interface CrossfishExpect {
    /**
     * Assertions and validation for general variables of any type.
     */
    (validatorNamespace: string): BaseAssertions;
    /**
     * Assertions and validation for String variables.
     */
    string(validatorNamespace: string): StringAssertions;
    /**
     * Assertions and validation for Boolean variables.
     */
    bool(validatorNamespace: string): BooleanAssertions;
}

export const expect : CrossfishExpect = Object.assign(
    (validatorNamespace: string) => { return new BaseAssertions(validatorNamespace); },
    { 
        string: (validatorNamespace: string) => { return new StringAssertions(validatorNamespace); },
        bool: (validatorNamespace: string) => { return new BooleanAssertions(validatorNamespace); }
    }
);