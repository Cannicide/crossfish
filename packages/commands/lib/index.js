import CrossfishCommand from "./command";
import CrossfishHandler from "./handler";
import ErrorUtil from "./errors";
import fs from "fs";
import { Client } from "discord.js";
/**
 * Creates a new slash command with the given name and description.
 */
export function command(name, description) {
    return new CrossfishCommand(name, description);
}
/**
 * Documents all commands' argument names mapped to descriptions and localizations, via JSON file or JSON-compatible Object literal.
 * The provided JSON can contain data for one or more commands, facilitating the documentation of multiple commands with one JSON file.
 *
 * This method functions the same as using '.docs()' manually on all of your commands.
 * It is recommended to use this method before initializing your commands, to allow the documentation to apply to the commands before publishing them.
 * @example
 * docs({
 *  // Basic documentation of command 'cmd1':
 *  "cmd1": {
 *      // Descriptions of '/cmd1 group add <name> <description>' and '/cmd1 group get <name>':
 *      "group add": "Adds a group.",
 *      "group add <name>": "The name of the group to add.",
 *      "group add <description>": "The description of the group to add.",
 *      "group get": "Gets a group.",
 *      "group get <name>": "The name of the group to get.",
 *
 *      // Descriptions of '/cmd1 user add <user> <data>' and '/cmd1 user get <user>':
 *      "user add": "Adds a user.",
 *      "user add <user>": "The user to add.",
 *      "user add <data>": "The data of the user.",
 *      "user get": "Gets a user.",
 *      "user get <user>": "The user to get."
 *  },
 *
 *  // Documentation of command 'cmd2' with localizations:
 *  "cmd2": {
 *      // Descriptions of '/cmd2 group add <name> <description>' and '/cmd2 group get <name>':
 *      "group add": "Adds a group.",
 *      "group add <name>": {
 *          "en-US": "The name of the group to add.",
 *          "en-UK": "The name of the group to add, chap."
 *      },
 *      "group add <description>": "The description of the group to add.",
 *      "group get": "Gets a group.",
 *      "group get <name>": "The name of the group to get."
 *  }
 * });
 */
export function docs(json) {
    CrossfishCommand.docs = json;
}
class CrossfishUtils {
    // TODO: move this class and its methods to @crossfish/utils
    /**
     * Utility to load a file, or recursively load all files and subfolders within a folder.
     * Used internally by @crossfish/commands to load command files.
     * @private
     */
    static async loadFiles(dir) {
        dir = dir.replace("C:", "").replace(/\\/g, "/");
        ErrorUtil.pred(() => !fs.existsSync(dir), `Invalid path to command file/directory '${dir}' provided.\nBe sure to use an absolute path, such as '__dirname + "/commands"'`);
        if (!fs.lstatSync(dir).isDirectory())
            return this.loadFile(dir);
        let files = fs.readdirSync(dir);
        for (const file of files) {
            let path = dir + "/" + file;
            if (fs.lstatSync(path).isDirectory()) {
                await this.loadFiles(path);
            }
            else if (path.endsWith(".js") || path.endsWith(".cjs") || path.endsWith(".mjs") || path.endsWith(".ts")) {
                await this.loadFile(path);
            }
        }
    }
    /**
     * Loads a single file.
     * Used internally by loadFiles() to load command files.
     * @private
     */
    static async loadFile(path) {
        await import(path);
    }
}
function isExistingClient(opts) {
    return "client" in opts;
}
/**
 * Initializes the command handler. This method must be called to create, update, and handle your commands.
 * Can use an existing Discord.js Client, or create a new one for you.
 */
export default function crossfishHandler(opts) {
    if (opts.errors) {
        CrossfishHandler.Errors = { ...CrossfishHandler.Errors, ...opts.errors };
    }
    let client;
    if (isExistingClient(opts))
        client = opts.client;
    else {
        client = new Client(opts);
        client.login(opts.token);
    }
    const commandPath = "./";
    client.once("ready", async () => {
        await CrossfishUtils.loadFiles(commandPath);
        if ("guilds" in opts)
            CrossfishHandler.debugGuilds(opts.guilds);
        CrossfishHandler.initialize(client, !!opts.guilds);
        await CrossfishHandler.initialized;
    });
    return client;
}
// TODO: add message and user commands
