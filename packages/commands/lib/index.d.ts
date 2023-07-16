import CrossfishCommand from "./command.js";
import { CrossfishDocMap, ExistingClientOptions, NewClientOptions } from "./types.js";
import { Client } from "discord.js";
/**
 * Creates a new slash command with the given name and description.
 */
export declare function command(name: string, description: string): CrossfishCommand;
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
export declare function docs(json: string | CrossfishDocMap): void;
/**
 * Initializes the command handler. This method must be called to create, update, and handle your commands.
 * Can use an existing Discord.js Client, or create a new one for you.
 */
export default function crossfishHandler(opts: ExistingClientOptions | NewClientOptions): Client<boolean>;
