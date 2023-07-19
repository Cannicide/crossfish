import CrossfishCommand from "./command.js";
import CrossfishHandler from "./handler.js";
import { CrossfishDocMap, ExistingClientOptions, NewClientOptions } from "./types.js";
import fs from "fs";
import path from "path";
import { BitFieldResolvable, Client, IntentsBitField } from "discord.js";

/**
 * Creates a new slash command with the given name and description.
 */
export function command(name: string, description: string) {
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
export function docs(json: string|CrossfishDocMap) {
    CrossfishCommand.docs = json;
}

class CrossfishUtils {
    // TODO: move this class and its methods to @crossfish/utils

    /**
     * Utility to load a file, or recursively load all files and subfolders within a folder.
     * Used internally by @crossfish/commands to load command files.
     * @private
     */
    static async loadFiles(relativeDir: string, ignoreWarnings = false) {
        const dir = CrossfishUtils.relativePath(relativeDir);

        if (!fs.existsSync(dir)) {
            if (!ignoreWarnings) console.warn(`[@crossfish/commands] Failed to load provided path '${dir}'.`);
            return;
        }

        if (!fs.lstatSync(dir).isDirectory()) return this.loadFile(dir);
        let files = fs.readdirSync(dir);

        for (const file of files) {
            let path = dir + "/" + file;
            if (fs.lstatSync(path).isDirectory()) {
                await this.loadFiles(path, ignoreWarnings);
            } else if (path.endsWith(".js") || path.endsWith(".cjs") || path.endsWith(".mjs")) {
                await this.loadFile(path);
            }
        }
    }

    /**
     * Loads a single file.
     * Used internally by loadFiles() to load command files.
     * @private
     */
    static async loadFile(path: string) {
        await import("file://" + path);
    }

    /**
     * Derived and modified from https://stackoverflow.com/a/67576784/6901876
     */
    static relativePath(p: string): string {
        if (!p.startsWith(".")) return p;

        const error: Error = new Error();
        const stack: string[] = error.stack?.split('\n') as string[];
        const data: string = stack[3];

        const filePathPattern: RegExp = new RegExp(`(file:[/]{2}.+[^:0-9]):{1}[0-9]+:{1}[0-9]+`);
        const result: RegExpExecArray = filePathPattern.exec(data) as RegExpExecArray;

        let filePath: string = '';
        if (result && (result.length > 1)) {
            filePath = result[1];
        }

        filePath = path.dirname(filePath.replace("file:///", ""));
        return decodeURIComponent(path.resolve(filePath, p));
    }

    /**
     * Gets all intents.
     * 
     * ONLY FOR INTERNAL TESTING/DEBUGGING PURPOSES.
     * NOT RECOMMENDED TO USE IN PRODUCTION.
     */
    static allIntents() : BitFieldResolvable<string, any>[] {
        return Object.values(IntentsBitField.Flags);
    }
}

function isExistingClient(opts: ExistingClientOptions | NewClientOptions): opts is ExistingClientOptions {
    return "client" in opts;
}

/**
 * Initializes the command handler. This method must be called to create, update, and handle your commands.
 * Can use an existing Discord.js Client, or create a new one for you.
 */
export default function crossfishHandler(opts: ExistingClientOptions | NewClientOptions) : Client {

   if (opts.errors) {
       CrossfishHandler.Errors = {...CrossfishHandler.Errors, ...opts.errors};
   }

   let client: Client;
   if (isExistingClient(opts)) client = opts.client;
   else {
        client = new Client(opts);
        client.login(opts.token);
   }

   let commandsPath = CrossfishUtils.relativePath(opts.path ?? "./commands");

   client.once("ready", async () => {
       await CrossfishUtils.loadFiles(commandsPath, true);
       if ("guilds" in opts) CrossfishHandler.debugGuilds(opts.guilds as string[]);
       CrossfishHandler.initialize(client, !!opts.debug);
       await CrossfishHandler.initialized;
   });

   return client;
}

export const utils = CrossfishUtils;

// TODO: add message and user commands