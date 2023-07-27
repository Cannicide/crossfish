import vm from "node:vm";
import chalk from "chalk";
import path from "node:path";

export interface CrossfishReplContext {
    [globalVariable: string|symbol]: any
}

const createContext = () => vm.createContext(Object.defineProperties({ ...global }, Object.getOwnPropertyDescriptors(global))) as CrossfishReplContext;

/**
 * @private
 */
const ContextManager = {
    ctx: createContext(),
    addedKeys: new Set<string|symbol>(),
    globals: new Map<string, any>(),
    async init() {
        // Import @crossfish/utils/expect
        if (!this.globals.has("expect")) this.globals.set("expect", (await import("../index.js")).expect);

        // Remove require
        if (!this.globals.has("require")) this.globals.set("require", (path: string) => {
            console.log(chalk.yellowBright("// The Crossfish REPL does not support 'require()'\n// Use the '.import' command instead, ex:"));
            console.log(chalk.yellowBright("[0]: .import node:path as path"));
            console.log(chalk.yellowBright("[1]: path.resolve('/some/path');"));
            const fauxResult: any = new Proxy({}, {
                get() {
                    return fauxResult;
                },
                set() {
                    return false;
                },
            });
            return fauxResult;
        });

        // Add dirname
        if (!this.globals.has("__dirname")) this.globals.set("__dirname", path.dirname(import.meta.url));

        for (const key of this.addedKeys) delete this.ctx[key];
        for (const [ key, val ] of this.globals.entries()) this.ctx[key] = val;
        this.addedKeys.clear();

        return;
    },
    addKey(key: string, val: any) {
        this.ctx[key] = val;
        this.addedKeys.add(key);
    },
    clear() {
        this.ctx = createContext();
        this.init();
    }
};

const contextProxy = new Proxy(ContextManager.ctx, {
    get(target, p, receiver) {
        return Reflect.get(target, p, receiver);
    },
    set(target, p, newValue, receiver) {
        Reflect.set(target, p, newValue, receiver);
        ContextManager.addedKeys.add(p);
        return true;
    }
});

export { ContextManager, contextProxy as ctx };

export default async function crossfishEval(cmd: string, _context: any, _filename: string, callback: Function) {
    let result;
    let err = null;

    try {
        result = await vm.runInContext(cmd, ContextManager.ctx, {
            breakOnSigint: false
        });
    }
    catch (e) {
        err = e;
    }

    ContextManager.ctx.$0 = result;
    return callback(err, result);
}