import CrossfishSyntax from "./syntax";
import {
    SlashCommandBuilder,
    SlashCommandSubcommandBuilder,
    SlashCommandSubcommandGroupBuilder,
    PermissionsBitField,
    ChatInputCommandInteraction,
    PermissionResolvable,
    SlashCommandStringOption
} from "discord.js";
import { ArgType, SubType, ArgTypeUtil, SubTypeUtil, Command, CrossfishPermissions, RawArgumentData, CrossfishDocMap, CrossfishDoc, CrossfishLocalizations, CrossfishCommandAction, CrossfishAutocompleteActionMap, CrossfishCommandActionMap, CommandData } from "./types";
import CrossfishHandler from "./handler";
import ErrorUtil from "./errors";

/**
 * A method that executes a command, given an interaction.
 * @callback CrossfishAction
 * @param {import("discord.js").ChatInputCommandInteraction} interaction
 */

/**
 * A method that returns autocomplete results, given an interaction.
 * @callback CrossfishAutoComplete
 * @param {import("discord.js").AutocompleteInteraction} interaction
 * @returns {*[]}
 */

/**
 * A map of subcommands/subgroups to action methods.
 * @typedef {Object<string,CrossfishAction>} CrossfishActionMap
 */

/** 
 * The syntax of an argument to a Crossfish command.
 * @typedef {String} CrossfishArgument
 */

/**
 * Whether this sub-element is a subcommand, subgroup, or contains both.
 * @typedef {String} CrossfishSubType
 */

/**
 * Util function for checking if a value is defined.
 */
function isDefined(value: any) {
    return value !== null && typeof value !== "undefined" && value !== undefined;
}

class CrossfishCommand implements Command {

    builder = new SlashCommandBuilder();
    #documented = false;
    static docs = null;

    /**
     * @private
     */
    data = {
        subs: new Map(),
        autoComplete: new Map(),
        requires: {
            perms: new Set<CrossfishPermissions>(),
            roles: new Set<string>()
        },
        channels: new Set<string>(),
        guilds: new Set<string>(),
        docs: {},
        action: (interaction: ChatInputCommandInteraction) => {},
        JSON: undefined
    } as CommandData

    constructor(name: string, description: string) {
        this.commandName(name);
        this.commandDescription(description);
    }

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
    docs(json: string|CrossfishDocMap) : CrossfishCommand {
        if (this.#documented) return this;

        ErrorUtil.noexist(json, "JSON or path to JSON was not provided to docs()");
        if (typeof json === "string") {
            ErrorUtil.pred(() => !require("fs").existsSync(json), `Invalid path to JSON file '${json}' provided.\nBe sure to use an absolute path, such as 'Crossfish.dirname("/docs.json")'`);
            json = require(json);
        }

        const out = json as CrossfishDocMap;
        ErrorUtil.pred(() => !(this.builder.name in out), `The provided documentation JSON does not contain documentation for command '${this.builder.name}'`);

        this.data.docs = out[this.builder.name];
        return this;
    }

    /**
     * Sets the name of the command.
     * Used internally during construction.
     * @private
     */
    commandName(name: string) : CrossfishCommand {
        ErrorUtil.noexist(name, "Command name was not provided");
        ErrorUtil.badtype(name, "string", "command name");
        ErrorUtil.minmax(name.length, "command name length", 1, 32);
        ErrorUtil.slashname(name, "command");

        this.builder.setName(name);
        return this;
    }

    /**
     * Sets the description of the command.
     * Used internally during construction
     * @private
     */
    commandDescription(description: string) : CrossfishCommand {
        ErrorUtil.noexist(description, "Command description was not provided");
        ErrorUtil.badtype(description, "string", "command description");
        ErrorUtil.minmax(description.length, "command description length", 1, 100);

        this.builder.setDescription(description);
        return this;
    }

    /**
     * Adds a subcommand or subgroup to the command.
     * Mostly useful for documenting descriptions when not using docs().
     * Used internally by docs() and rawArgument().
     * @private
     */
    addRawSub( name: string, description = "No description provided.", type: string ) : CrossfishCommand {
        if (this.data.subs.has(name)) return this;

        ErrorUtil.noexist(name, "Subcommand/subgroup name was not provided");
        ErrorUtil.badtype(name, "string", "subcommand/subgroup name");
        ErrorUtil.noexist(description, "The Discord API requires subcommand/subgroup descriptions, and one was not provided");
        ErrorUtil.badtype(description, "string", "subcommand/subgroup description");
        ErrorUtil.minmax(name.length, "subcommand/subgroup name length", 1, 32);
        ErrorUtil.slashname(name, "subcommand/subgroup");

        let [ subgroup, subcommand ] = name.split(" ");
        if (subgroup && subcommand) type = SubType.Hybrid;

        if (type == SubType.Hybrid) {
            // 'subgroup' is subgroup with subcommand

            if (!this.data.subs.has(subgroup)) this.addRawSub(subgroup, subgroup + ".", SubType.Subgroup);
            const sub = new SlashCommandSubcommandBuilder().setName(subcommand).setDescription(description);
            const group = this.data.subs.get(subgroup) as SlashCommandSubcommandGroupBuilder;
            group.addSubcommand(sub);
            this.data.subs.set(name, sub);

        }
        else if (subgroup && type == SubType.Subcommand) {
            // 'subgroup' is subcommand with no subgroup

            subcommand = subgroup;
            const sub = new SlashCommandSubcommandBuilder().setName(subcommand).setDescription(description);
            this.builder.addSubcommand(sub);
            this.data.subs.set(name, sub);

        }
        else if (subgroup && type == SubType.Subgroup) {
            // 'subgroup' is subgroup with no subcommand

            const sub = new SlashCommandSubcommandGroupBuilder().setName(subgroup).setDescription(description);
            this.builder.addSubcommandGroup(sub);
            this.data.subs.set(name, sub);
        }

        return this;
    }

    /**
     * @private
     * @deprecated Use .arguments() instead
     */
    argument(syntax: string) : CrossfishCommand {
        ErrorUtil.noexist(syntax, "Argument syntax was not provided");
        ErrorUtil.badtype(syntax, "string", "argument syntax");

        const args = CrossfishSyntax.parseArgument(syntax);
        args.filter(a => !a.sub).forEach(arg => this.rawArgument({
            ...arg,
            subgroup: args.find(a => a.subgroup)?.name,
            subcommand: args.find(a => a.subcommand)?.name
        }));

        if (args.every(a => a.sub)) this.rawArgument({
            subgroup: args.find(a => a.subgroup)?.name,
            subcommand: args.find(a => a.subcommand)?.name
        });

        return this;
    }

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
    arguments(...args: string[]|string[][]) : CrossfishCommand {
        ErrorUtil.noexist(args, "Data of arguments were not provided");

        args = args.flat(1);
        args.forEach(arg => this.argument(arg));

        return this;
    }

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
    rawArgument({
        name,
        description = "No description provided.",
        type = "string",
        optional = false,
        subcommand,
        subgroup,
        choices,
        max,
        min,
        maxLength,
        minLength
    } : RawArgumentData) : CrossfishCommand {
        if (isDefined(name)) ErrorUtil.noexist(name, "Argument name was not provided");
        if (isDefined(name)) ErrorUtil.badtype(name, "string", "argument name");
        ErrorUtil.badtype(type, "string", "argument type");
        ErrorUtil.badtype(optional, "boolean", "argument optionality");
        ErrorUtil.exclusive(min, choices, "min", "choices");
        ErrorUtil.exclusive(max, choices, "max", "choices");
        ErrorUtil.exclusive(maxLength, choices, "maxLength", "choices");
        ErrorUtil.exclusive(minLength, choices, "minLength", "choices");
        if (isDefined(subcommand)) ErrorUtil.badtype(subcommand, "string", "argument subcommand name");
        if (isDefined(subgroup)) ErrorUtil.badtype(subgroup, "string", "argument subgroup name");
        if (isDefined(subgroup)) ErrorUtil.noexist(subcommand, "Argument subcommand must be provided if a subgroup is provided");
        if (isDefined(choices)) ErrorUtil.badtype(choices, "array", "argument choices");
        if (isDefined(max)) ErrorUtil.badtype(max, "number", "argument max value");
        if (isDefined(min)) ErrorUtil.badtype(min, "number", "argument min value");
        if (isDefined(maxLength)) ErrorUtil.badtype(maxLength, "number", "argument maxLength value");
        if (isDefined(minLength)) ErrorUtil.badtype(minLength, "number", "argument minLength value");
        if (isDefined(max) && isDefined(min)) ErrorUtil.pred(() => (max ?? 0) < (min ?? 0), "Invalid argument max and min values; max must be larger than min");
        if (isDefined(maxLength) && isDefined(minLength)) ErrorUtil.pred(() => (maxLength ?? 0) < (minLength ?? 0), "Invalid argument max and min values; maxLength must be larger than minLength");
        if (isDefined(choices)) ErrorUtil.minmax(choices?.length, "number of choices", 1, 25);
        ErrorUtil.pred(() => choices && choices.some(c => !ArgTypeUtil.isChoiceType(c)), `Only argument choices of datatypes ${ArgTypeUtil.choiceTypes().join(", ")} are supported`);
        ErrorUtil.pred(() => choices && choices.some(c => c.toString().length < 1 || c.toString().length > 100), `At least one argument choice falls outside the required length range of 1-100 characters`);
        if (isDefined(description)) ErrorUtil.minmax(description.length, "argument description length", 1, 100);
        if (isDefined(name)) ErrorUtil.minmax(name?.length, "argument name length", 1, 32);
        if (isDefined(name)) ErrorUtil.slashname(name, "argument");

        // Check datatype
        let parsedType = ArgTypeUtil.get(type);

        ErrorUtil.pred(() => parsedType == ArgType.Unknown, `An invalid argument datatype, '${type}', was unable to be interpreted`);
        ErrorUtil.pred(() => (isDefined(max) || isDefined(min)) && !ArgTypeUtil.isNumeric(parsedType), "Argument datatype must be numeric when using max or min");
        ErrorUtil.pred(() => (isDefined(maxLength) || isDefined(minLength)) && parsedType != ArgType.String, "Argument datatype must be string when using maxLength or minLength");
        ErrorUtil.pred(() => isDefined(minLength) && !Number.isInteger(minLength), "Argument minLength value must be an integer");
        ErrorUtil.pred(() => isDefined(maxLength) && !Number.isInteger(maxLength), "Argument maxLength value must be an integer");
        ErrorUtil.pred(() => choices && choices.length == 0, "If using argument choices, at least one choice must be provided");
        ErrorUtil.pred(() => choices && choices.some(c => typeof c != ArgTypeUtil.asPrimitive(parsedType)), `At least one argument choice is of invalid datatype. Choices of a '${type}' argument should be of type '${ArgTypeUtil.asPrimitive(parsedType)}'`);

        // Initialize variables

        let builder;
        const sub = ((subgroup ?? "") + " " + (subcommand ?? "")).trim();
        const autoName = (sub + " " + name).trim();

        // Handle subcommand and subgroup

        if (subcommand) {
            this.addRawSub(sub, undefined, SubTypeUtil.getType(subgroup, subcommand));
            builder = this.data.subs.get(sub) as SlashCommandSubcommandBuilder;

            if (!name) return this;
        }
        else builder = this.builder;

        // Add Argument

        let addArgument;

        if (ArgTypeUtil.isChannel(parsedType)) addArgument = builder.addChannelOption.bind(builder);
        else if (parsedType == ArgType.User) addArgument = builder.addUserOption.bind(builder);
        else if (parsedType == ArgType.Bool) addArgument = builder.addBooleanOption.bind(builder);
        else if (parsedType == ArgType.Role) addArgument = builder.addRoleOption.bind(builder);
        else if (parsedType == ArgType.Mention) addArgument = builder.addMentionableOption.bind(builder);
        else if (parsedType == ArgType.Float) addArgument = builder.addNumberOption.bind(builder);
        else if (parsedType == ArgType.Int) addArgument = builder.addIntegerOption.bind(builder);
        else if (parsedType == ArgType.File) addArgument = builder.addAttachmentOption.bind(builder);
        else addArgument = builder.addStringOption.bind(builder);

        addArgument((arg: any) => {
            arg.setName(name)
            .setDescription(description);

            arg.setRequired(!optional);
            if (isDefined(min)) arg.setMinValue(min);
            if (isDefined(max)) arg.setMaxValue(max);
            if (isDefined(maxLength)) arg.setMaxLength(maxLength);
            if (isDefined(minLength)) arg.setMinLength(minLength);

            if (ArgTypeUtil.isChannel(parsedType)) arg.addChannelTypes(...parsedType);

            if (choices) arg.addChoices(...choices.map(choice => ({ name: choice, value: choice })));

            ErrorUtil.isdupe(autoName, this.data.subs, "argument name");
            this.data.subs.set(autoName, arg);
            return arg;
        });

        return this;
    }

    /**
     * Adds a required permission or role to the command.
     * Specify role names/IDs starting with "@" (e.g. "@Administrator"), and perm names without it (e.g. "Administrator").
     * @private
     * @deprecated Use .requires() instead.
     */
    require(permOrRole: string|CrossfishPermissions) : CrossfishCommand {
        ErrorUtil.noexist(permOrRole, "Permission or role name/ID was not provided");

        const perms = Object.keys(PermissionsBitField.Flags).map(key => key.toLowerCase());

        if (typeof permOrRole !== "string") {
            const perm = permOrRole as CrossfishPermissions;
            if (Object.values(PermissionsBitField.Flags).includes(perm as bigint)) this.data.requires.perms.add(perm);
        }
        else {
            const role = permOrRole as string;
            const value = role.replace("@", "");
            if (perms.includes(role.toLowerCase()) && !role.startsWith("@")) this.data.requires.perms.add(PermissionsBitField.resolve(value as PermissionResolvable));
            else this.data.requires.roles.add(value);
        }

        return this;
    }

    /**
     * Adds one or more required permissions or roles to the command at once.
     * Specify role names/IDs starting with "@" (e.g. "@Mod"), and perm names without it (e.g. "Administrator").
     */
    requires(...permsOrRoles: string[]|string[][]) : CrossfishCommand {
        ErrorUtil.noexist(permsOrRoles, "Permissions or roles were not provided");

        permsOrRoles = permsOrRoles.flat(1);
        permsOrRoles.forEach(permOrRole => this.require(permOrRole));
        return this;
    }

    /**
     * Defines a channel that the command can be used in.
     * Do not use this method if you want the command to be used in any channel.
     * @private
     * @deprecated Use .channels() instead.
     */
    channel(channel: string) : CrossfishCommand {
        ErrorUtil.noexist(channel, "Channel name/ID was not provided");
        ErrorUtil.badtype(channel, "string", "channel name/ID");

        this.data.channels.add(channel.replace(/ /g, "-").replace(/#/g, "").toLowerCase());
        return this;
    }

    /**
     * Defines one or more specific channels that the command can be used in.
     * Do not use this method if you want the command to be used in every channel.
     */
    channels(...channels: string[]|string[][]) : CrossfishCommand {
        ErrorUtil.noexist(channels, "Channels were not provided");

        channels = channels.flat(1);
        channels.forEach(channel => this.channel(channel));
        return this;
    }

    /**
     * Defines a guild that the command can be used in.
     * Do not use this method if you want the command to be used in ANY guild.
     * @private
     * @deprecated Use .guilds() instead.
     */
    guild(guild: string) : CrossfishCommand {
        ErrorUtil.noexist(guild, "Guild ID was not provided");
        ErrorUtil.badtype(guild, "string", "guild ID");

        this.data.guilds.add(guild);
        return this;
    }

    /**
     * Defines one or more guilds that the command can be used in.
     * Do not use this method if you want the command to be published to every guild it is in.
     */
    guilds(...guilds: string[]|string[][]) : CrossfishCommand {
        ErrorUtil.noexist(guilds, "Guilds were not provided");

        guilds = guilds.flat(1);
        guilds.forEach(guild => this.guild(guild));
        return this;
    }

    /**
     * Sets whether use of this command in DMs is enabled when globally published.
     */
    allowDM(enabled = true) : CrossfishCommand {
        ErrorUtil.badtype(enabled, "boolean", "allow DM argument");
        ErrorUtil.pred(() => !!this.data.guilds.size, "Cannot enable DM permission on guild command");

        this.builder.setDMPermission(enabled);
        return this;
    }

    /**
     * Makes this command NSFW-only.
     * NSFW-only commands can only be used in NSFW channels.
     */
    nsfw() : CrossfishCommand {
        this.builder.setNSFW(true);
        return this;
    }

    /**
     * Defines argument/subcommand descriptions, with support for localizations in various languages.
     * Used internally by docs().
     * @private
     */
    descriptions(descriptions: CrossfishDoc) : CrossfishCommand {
        if (this.#documented) return this;
        ErrorUtil.noexist(descriptions, "Argument/subcommand descriptions were not provided");

        for (const rawKey of Object.keys(descriptions)) {
            const key = rawKey.replace(/[^-_ \p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]/gu, "");

            ErrorUtil.hasnot(key, this.data.subs, `The argument/subcommand '${rawKey}' provided to descriptions() or document() is nonexistent`);
            const arg = this.data.subs.get(key)!;

            if (typeof descriptions[rawKey] == "string") arg.setDescription(descriptions[rawKey] as string);
            else {
                const localizations = descriptions[rawKey] as CrossfishLocalizations;

                if ("default" in localizations) {
                    arg.setDescription(localizations["default"] as string);
                    delete localizations["default"];
                }
                else if ("en-US" in localizations) arg.setDescription(localizations["en-US"]);
                else if ("en-GB" in localizations) arg.setDescription(localizations["en-GB"]);
                else ErrorUtil.noexist(null, "Every argument/subcommand must provide either a 'default' description or an 'en-US'/'en-GB' localized description");

                arg.setDescriptionLocalizations(localizations);
            }
        }

        this.#documented = true;
        return this;
    }

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
    autocomplete(methods: CrossfishAutocompleteActionMap) : CrossfishCommand {
        ErrorUtil.noexist(methods, "Autocomplete methods were not provided");

        for (const rawKey of Object.keys(methods)) {
            const key = rawKey.replace(/[^-_ \p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]/gu, "");

            ErrorUtil.hasnot(key, this.data.subs, `The argument '${rawKey}' provided to autocomplete() is nonexistent`);
            ErrorUtil.pred(() => !("autocomplete" in this.data.subs.get(key)!), `The argument '${rawKey}' provided to autocomplete() is not autocompletable`);
            ErrorUtil.pred(() => ((this.data.subs.get(key) as SlashCommandStringOption).choices?.length ?? 0) > 0, `The argument '${rawKey}' provided to autocomplete() has choices defined, and cannot be made autocompletable`);
            (this.data.subs.get(key) as SlashCommandStringOption).setAutocomplete(true);

            this.data.autoComplete.set(key, methods[rawKey]);
        }

        return this;
    }

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
     * 
     * @param {CrossfishAction|CrossfishActionMap} method - The method or methods to execute when the command is used.
    */
    action(method: CrossfishCommandAction | CrossfishCommandActionMap) {
        ErrorUtil.noexist(method, "Command action was not provided");

        if (typeof method === "function") this.data.action = method;
        else {
            const methods = /** @type {Map<String, CrossfishAction>} */ (new Map());
            const { def } = require("./index");

            for (const rawKey of Object.keys(method)) {
                const key = rawKey == def ? rawKey : rawKey.replace(/[^-_ \p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]/gu, "");

                if (key != def) ErrorUtil.hasnot(key, this.data.subs, `The subcommand or subgroup '${rawKey}' provided to action() is nonexistent`);
                methods.set(key, method[rawKey]);
            }

            this.data.action = interaction => {
                const subgroup = interaction.options.getSubcommandGroup(false) ?? "";
                const subcommand = interaction.options.getSubcommand(false) ?? "";

                const combo = (subgroup + " " + subcommand).trim();
                if (methods.has(combo)) methods.get(combo)(interaction); // High priority to specific subcommands in subgroups
                else if (methods.has(subgroup)) methods.get(subgroup)(interaction); // Lower priority to subgroups in general
                else if (methods.has(def)) methods.get(def)(interaction); // Lowest priority to default handler
            };
        }

        return this.build();
    }

    /**
     * @private
     */
    build() {
        // Handle documentation

        if (CrossfishCommand.docs && !this.data.docs) this.docs(CrossfishCommand.docs);
        if (this.data.docs) this.descriptions(this.data.docs);

        // Build command

        this.data.JSON = this.builder.toJSON();
        CrossfishHandler.setCommand(this.data.JSON.name, this as Command);
    }
}

export default CrossfishCommand;