import { Collection } from "discord.js";
import ErrorUtil from "./errors";
class CrossfishHandler {
    static #cache = new Collection();
    static initialized = false;
    static client;
    static #debug;
    static #testGuilds = [];
    static Errors = {
        Channel: "> 🚷 **You cannot use this command in this channel.**",
        Perms: "> ⛔ **You do not have the necessary perms to use this command.**",
        Roles: "> ⛔ **You do not have the necessary roles to use this command.**",
        Execution: "> ⚠️ **Sorry, an error occurred while running this command.**"
    };
    static size() {
        return this.#cache.size;
    }
    static async initialize(client, debug) {
        this.client = client;
        this.#debug = debug;
        this.initializeAutocomplete();
        this.initialized = await this.initializeCommands();
    }
    static debugGuilds(testGuilds) {
        this.#testGuilds = testGuilds;
        for (const command of this.#cache.values()) {
            for (const guild of testGuilds) {
                if (!command.data.guilds.has(guild))
                    command.data.guilds.add(guild);
            }
        }
    }
    static getCommand(commandName) {
        return this.#cache.get(commandName) ?? null;
    }
    static async setCommand(commandName, command) {
        this.#cache.set(commandName, command);
        if (await this.initialized)
            this.postInitializeCommand(command);
    }
    static debug(...m) {
        if (this.#debug)
            console.log(...m);
    }
    static getGuilds(...ids) {
        if (ids.flat().length)
            return this.client.guilds.cache.filter(g => ids.flat().includes(g.id));
        return this.client.guilds.cache;
    }
    static initializeAutocomplete() {
        this.client.on("interactionCreate", async (interaction) => {
            if (!interaction.isAutocomplete())
                return;
            let autoCompleteMap = this.getCommand(interaction.commandName)?.data.autoComplete;
            if (!autoCompleteMap)
                return;
            const arg = interaction.options.getFocused(true).name;
            let subcommand = interaction.options.getSubcommand(false);
            let subgroup = interaction.options.getSubcommandGroup(false);
            const argName = ((subgroup ?? "") + " " + (subcommand ?? "") + " " + arg).trim();
            let autoComplete = autoCompleteMap.get(argName);
            if (autoComplete) {
                let result = await autoComplete(interaction);
                ErrorUtil.badtype(result, "array", "autoComplete callback return result");
                if (!result)
                    interaction.respond([]);
                else
                    interaction.respond(result.map((key) => ({ name: key, value: key })));
            }
        });
    }
    static async initializeCommands() {
        // Filter out and separate application and guild commands:
        const [applicationCommands, guildCommands] = this.#cache.partition(c => !c.data.guilds.size);
        // Set application commands:
        if (applicationCommands.size) {
            try {
                await this.client.application?.commands?.set(applicationCommands.map(c => c?.data.JSON).map(j => {
                    this.debug("PUBLISHED GLOBAL COMMAND:", j.name);
                    return j;
                }));
            }
            catch (err) {
                this.debug(`FAILED TO PUBLISH GUILD COMMANDS`);
                ErrorUtil.pred(() => true, `Crossfish Commands Error: Issue publishing guild commands.\nError Message: ${err.message}`);
            }
        }
        // Set guild commands:
        const guilds = guildCommands.map(c => [...c.data.guilds.values()]).flat();
        for (const guild of this.getGuilds(guilds).values()) {
            try {
                await guild?.commands?.set(guildCommands.filter(c => c.data.guilds.has(guild.id)).map(c => c?.data.JSON).map(j => {
                    this.debug(`PUBLISHED GUILD <${guild.id}> COMMAND:`, j.name);
                    return j;
                }));
            }
            catch (err) {
                this.debug(`FAILED TO PUBLISH GLOBAL COMMANDS`);
                ErrorUtil.pred(() => true, `Crossfish Commands Error: Issue publishing guild commands.\nError Message: ${err.message}`);
            }
        }
        // Setup command listener:
        this.client.on("interactionCreate", async (interaction) => {
            if (!interaction.isChatInputCommand())
                return;
            let command = this.getCommand(interaction.commandName)?.data;
            if (!command)
                return;
            const channels = [...command.channels.values()];
            const perms = [...command.requires.perms.values()];
            const roles = [...command.requires.roles.values()];
            const action = command.action;
            const member = interaction.member;
            if (channels.length && interaction.channel && !interaction.channel.isDMBased() && !channels.some(c => c && (c == interaction.channel.name || c == interaction.channel?.id))) {
                if (CrossfishHandler.Errors.Channel)
                    interaction.reply({ content: CrossfishHandler.Errors.Channel, ephemeral: true });
                return;
            }
            if (!perms.every(p => member?.permissions.has(p))) {
                if (CrossfishHandler.Errors.Perms)
                    interaction.reply({ content: CrossfishHandler.Errors.Perms, ephemeral: true });
                return;
            }
            if (!roles.every(r => member?.roles.cache.some(role => r == role.name || r == role.id))) {
                if (CrossfishHandler.Errors.Roles)
                    interaction.reply({ content: CrossfishHandler.Errors.Roles, ephemeral: true });
                return;
            }
            try {
                await action(interaction);
            }
            catch (err) {
                setTimeout(() => {
                    if (interaction.deferred && CrossfishHandler.Errors.Execution)
                        interaction.editReply({ content: CrossfishHandler.Errors.Execution });
                    else if (!interaction.replied && CrossfishHandler.Errors.Execution)
                        interaction.reply({ content: CrossfishHandler.Errors.Execution, ephemeral: true });
                    setTimeout(() => ErrorUtil.pred(() => true, `Error occurred while executing command '${interaction.commandName}':\n\t${err.message}`), 100);
                }, 1000);
            }
        });
        return true;
    }
    static async postInitializeCommand(command) {
        if (!this.client)
            return;
        const data = command.data;
        // Add development config-mode testing guilds, if applicable:
        if (this.#debug) {
            for (const guild of this.#testGuilds) {
                if (!data.guilds.has(guild))
                    data.guilds.add(guild);
            }
        }
        if (data.guilds.size) {
            // Add guild command:
            for (const guild of this.getGuilds([...data.guilds.values()]).values()) {
                try {
                    const output = await guild?.commands?.create(data.JSON);
                    if (!output)
                        return;
                    this.debug(`POST-PUBLISHED GUILD <${guild.id}> COMMAND:`, data.JSON.name);
                }
                catch (err) {
                    this.debug(`FAILED TO POST-PUBLISH GUILD <${guild.id}> COMMAND:`, data.JSON.name);
                    ErrorUtil.pred(() => true, `Crossfish Commands Error: Issue post-publishing guild command.\nError Message: ${err.message}`);
                }
            }
        }
        else {
            // Add application command:
            try {
                const output = await this.client.application?.commands?.create(data.JSON);
                if (!output)
                    return;
                this.debug("POST-PUBLISHED GLOBAL COMMAND:", data.JSON.name);
            }
            catch (err) {
                this.debug(`FAILED TO POST-PUBLISH GLOBAL COMMAND:`, data.JSON.name);
                ErrorUtil.pred(() => true, `Crossfish Commands Error: Issue post-publishing global command.\nError Message: ${err.message}`);
            }
        }
    }
}
export default CrossfishHandler;