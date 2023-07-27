import repl from "node:repl";
import chalk from "chalk";
import crossfishEval, { ctx, ContextManager } from "./eval.js";

export { ctx, ContextManager };

export async function crossfishRepl() {
    await ContextManager.init();

    const server = repl.start({
        prompt: chalk.red("✮ > "),
        eval: crossfishEval,
        useGlobal: false,
        ignoreUndefined: false,
        replMode: repl.REPL_MODE_STRICT
    });
    let isRunning = true;

    server.defineCommand("clear", {
        help: "Break and clear local context",
        action() {
            this.clearBufferedCommand();
            ContextManager.clear();
            console.log(chalk.blueBright("// Cleared local variables from context."));
            this.displayPrompt();
        }
    });

    server.defineCommand("e", {
        help: "Shortcut to enter editor mode, allowing multiline editing",
        action() {
            this.clearBufferedCommand();
            server.commands.editor!.action.call(server, "");
            console.log(chalk.gray("// Pressing 'ENTER' or 'RETURN' will simply add a new line."));
            this.displayPrompt();
        }
    });

    server.defineCommand("import", {
        help: "Import a module using syntax '.import <module> as <variableName>'",
        async action(text) {
            this.clearBufferedCommand();
            const err = () => {
                console.log(chalk.redBright("// Invalid syntax. See the following example of proper syntax:"));
                console.log(chalk.redBright("[0]: .import fs as fileSys"));
                console.log(chalk.redBright("[1]: fileSys.readSync(...);"));
                this.displayPrompt();
            };
            
            if (!text || text == "") return err();
            
            const [ path, as, variableName ] = text.split(/[ ]+/g);
            if (!path || !as || !variableName || as != "as") return err();

            try {
                const modul = await import(path);
                ContextManager.addKey(variableName, modul);
                console.log(chalk.greenBright(`// Successfully imported module '${path}'`));
                console.log(chalk.greenBright(`// You can now reference this module using the variable '${variableName}'`));
            }
            catch {
                console.log(chalk.redBright(`// Failed to find and import module '${path}'`));
            }

            this.displayPrompt();
        }
    });

    const exitListener = () => {
        if (!isRunning) return;

        console.log(chalk.yellowBright(`========== ${chalk.red("✮ Crossfish REPL")} ==========`));
        console.log(chalk.whiteBright("Thank you for using Crossfish. Goodbye!"));
        isRunning = false;
    };

    server.on("exit", exitListener);
    process.on("SIGINT", exitListener);

    return server;
}