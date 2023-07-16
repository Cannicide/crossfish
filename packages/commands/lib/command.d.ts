import { SlashCommandBuilder } from "discord.js";
import { Command, CrossfishPermissions, RawArgumentData, CrossfishDocMap, CrossfishDoc, CrossfishCommandAction, CrossfishAutocompleteActionMap, CrossfishCommandActionMap, CommandData } from "./types.js";
declare class CrossfishCommand implements Command {
    #private;
    builder: SlashCommandBuilder;
    static docs?: string | CrossfishDocMap;
    /**
     * @private
     */
    data: CommandData;
    constructor(name: string, description: string);
    /**
     * Documents the command's argument names mapped to descriptions and localizations, via JSON file or JSON-compatible Object literal.
     * The provided JSON can contain data for more than one command, facilitating the documentation of multiple commands with one JSON file.
     *
     * This method, docs(), can be called before or after argument creation.
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
    docs(json: string | CrossfishDocMap): CrossfishCommand;
    /**
     * Sets the name of the command.
     * Used internally during construction.
     * @private
     */
    commandName(name: string): CrossfishCommand;
    /**
     * Sets the description of the command.
     * Used internally during construction
     * @private
     */
    commandDescription(description: string): CrossfishCommand;
    /**
     * Adds a subcommand or subgroup to the command.
     * Mostly useful for documenting descriptions when not using docs().
     * Used internally by docs() and rawArgument().
     * @private
     */
    addRawSub(name: string, description: string | undefined, type: string): CrossfishCommand;
    /**
     * @private
     * @deprecated Use .arguments() instead
     */
    argument(syntax: string): CrossfishCommand;
    /**
     * Adds one or more arguments to the command.
     * Special syntax is used to determine the argument's name, subcommand, datatype, optionality, and more.
     * The special syntax is highly simple and straightforward; see the demonstrations in the provided example.
     *
     * Note: Autocomplete and choices are mutually exclusive, so both cannot be provided for the same argument.
     * Note: Min and max properties can only be used on number-based argument datatypes.
     * Note: When using min/max/choices, datatype is auto-inferred by Crossfish.
     * @example
     * // All options demonstrated:
     * arguments("subgroup subcommand <required> <choices: dog | fox | pig> [optional] [datatype: float] [maxmin: 2 < x < 5.7] [maxminlength: 1 < l < 10]");
     *
     * // Minimum options demonstrated:
     * arguments("<required>");
     */
    arguments(...args: string[] | string[][]): CrossfishCommand;
    /**
     * Adds a raw argument to the command.
     * Special syntax is not supported by rawArgument; each option is its own property in the argument object.
     * Used internally by argument().
     *
     * Note: Autocomplete and choices are mutually exclusive, so both cannot be specified for the same argument.
     * Note: Min and max properties can only be used on number-based argument types
     * @example
     * // All options demonstrated:
     * rawArgument({
     *  name: "name", // Name of the argument
     *  description: "A description", // The description of the argument
     *  type: "float", // Datatype of the argument
     *  optional: true, // Whether the argument is optional or required
     *  subcommand: "sub", // The subcommand this argument belongs to
     *  subgroup: null, // The subgroup this argument and its subcommand belong to
     *  choices: [1.46, 7], // Choices that the user must choose from
     *  min: 2, // Minimum value of this float argument
     *  max: 5.7, // Maximum value of this float argument
     *  minLength: 1, // Minimum length if this were a string argument
     *  maxLength: 10 // Maximum length if this were a string argument
     * });
     * @private
     */
    rawArgument({ name, description, type, optional, subcommand, subgroup, choices, max, min, maxLength, minLength }: RawArgumentData): CrossfishCommand;
    /**
     * Adds a required permission or role to the command.
     * Specify role names/IDs starting with "@" (e.g. "@Administrator"), and perm names without it (e.g. "Administrator").
     * @private
     * @deprecated Use .requires() instead.
     */
    require(permOrRole: string | CrossfishPermissions): CrossfishCommand;
    /**
     * Adds one or more required permissions or roles to the command at once.
     * Specify role names/IDs starting with "@" (e.g. "@Mod"), and perm names without it (e.g. "Administrator").
     */
    requires(...permsOrRoles: string[] | string[][]): CrossfishCommand;
    /**
     * Defines a channel that the command can be used in.
     * Do not use this method if you want the command to be used in any channel.
     * @private
     * @deprecated Use .channels() instead.
     */
    channel(channel: string): CrossfishCommand;
    /**
     * Defines one or more specific channels that the command can be used in.
     * Do not use this method if you want the command to be used in every channel.
     */
    channels(...channels: string[] | string[][]): CrossfishCommand;
    /**
     * Defines a guild that the command can be used in.
     * Do not use this method if you want the command to be used in ANY guild.
     * @private
     * @deprecated Use .guilds() instead.
     */
    guild(guild: string): CrossfishCommand;
    /**
     * Defines one or more guilds that the command can be used in.
     * Do not use this method if you want the command to be published to every guild it is in.
     */
    guilds(...guilds: string[] | string[][]): CrossfishCommand;
    /**
     * Sets whether use of this command in DMs is enabled when globally published.
     */
    allowDM(enabled?: boolean): CrossfishCommand;
    /**
     * Makes this command NSFW-only.
     * NSFW-only commands can only be used in NSFW channels.
     */
    nsfw(): CrossfishCommand;
    /**
     * Defines argument/subcommand descriptions, with support for localizations in various languages.
     * Used internally by docs().
     * @private
     */
    descriptions(descriptions: CrossfishDoc): CrossfishCommand;
    /**
     * Defines methods that handle autocompletion on specified arguments.
     *
     * This method, autocomplete(), should only be called after autocompletable arguments are created.
     * @example
     * autocomplete({
     *  // Basic arguments:
     *  "<argname>": interaction => ["auto 1", "auto 2"],
     *
     *  // Subcommand arguments:
     *  "subcommand <argname>": interaction => ["apples", "oranges"],
     *
     *  // Subgroup arguments:
     *  "subgroup subcommand <*argname>": interaction => ["plane", "helicopter"],
     *
     *  // Intermediate method example (searching by first letter):
     *  "<hero>": interaction => {
     *      const heroes = ["batman", "superman", "spiderman", "hulk", "vision", "flash"];
     *      const query = interaction.options.getFocused();
     *
     *      // (Basic search that sorts heroes by closest to first letter of query)
     *      const f = (str) => Math.abs(query.charCodeAt(0) - str.charCodeAt(0));
     *      return heroes.sort((a, b) => f(a) - f(b));
     *  }
     * });
     */
    autocomplete(methods: CrossfishAutocompleteActionMap): CrossfishCommand;
    /**
     * Defines a method or methods to execute when the command is executed.
     * Can either define a single method to handle all calls to this command, several methods that handle specific subcommands/subgroups, or both.
     *
     * This method, action(), should be the last called of the command configuration methods, as the command is built by this method.
     * @example
     * // Basic, single-method:
     * action(interaction => {
     *  interaction.reply("Hello world!");
     * });
     *
     * // Advanced, multi-method:
     * action({
     *  // Handle specific subcommands:
     *  "subcmd1": interaction => {
     *      interaction.reply("Hello from subcommand 1!");
     *  },
     *  "subcmd2": interaction => {
     *      interaction.reply("Hello from subcommand 2!");
     *  },
     *
     *  // Handle specific subcommand within subgroup:
     *  "subgroup subcmd": interaction => {
     *      interaction.reply("Hello from the 'subcmd' subcommand of 'subgroup'!");
     *  },
     *
     *  // Handle all other subcommands within subgroup:
     *  "subgroup": interaction => {
     *      interaction.reply("Hello from any subcommand in 'subgroup' other than 'subcmd'!");
     *      // (The method for "subgroup subcmd" takes precedence over that of "subgroup".
     *      // i.e. the "subgroup" method is not called when "/cmd subgroup subcmd" is run.)
     *  },
     *
     *  // Handle all other uses of this command (default handler):
     *  "DEFAULT": interaction => {
     *      interaction.reply("Hello from everything else.");
     *  }
     * });
    */
    action(method: CrossfishCommandAction | CrossfishCommandActionMap): void;
    /**
     * @private
     */
    build(): void;
}
export default CrossfishCommand;
