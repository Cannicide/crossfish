import { ChatInputCommandInteraction, CommandInteractionOption } from "discord.js";

export function args(interaction: ChatInputCommandInteraction, resolved = true) {
    // TODO: add support for getting resolved args
    const args = {} as { [x: string]: string | number | boolean | undefined };
    const { ApplicationCommandOptionType } = require("discord-api-types/v10");

    function handle(data: readonly CommandInteractionOption[] | undefined) {
        if (!data) return;

        for (const layer of data) {
            if (layer.type == ApplicationCommandOptionType.SubcommandGroup && interaction.options.getSubcommandGroup(false) == layer.name) return handle(layer.options);
            if (layer.type == ApplicationCommandOptionType.Subcommand && interaction.options.getSubcommand(false) == layer.name) return handle(layer.options);
            if (interaction.options.get(layer.name, false)) args[layer.name] = layer.value;
        }
    }

    handle(interaction.options.data);
    return args;
}