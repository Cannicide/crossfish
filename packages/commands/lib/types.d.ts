import { ChannelType as CT, RESTPostAPIChatInputApplicationCommandsJSONBody, LocalizationMap } from "discord-api-types/v10";
import { AutocompleteInteraction, ChatInputCommandInteraction, Client, ClientOptions, PermissionResolvable, SlashCommandBuilder, SlashCommandStringOption, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js";
declare const ChannelType: {
    readonly Voice: readonly [CT.GuildVoice];
    readonly Stage: readonly [CT.GuildStageVoice];
    readonly Category: readonly [CT.GuildCategory];
    readonly Text: readonly [CT.GuildText];
    readonly Announcement: readonly [CT.GuildAnnouncement];
    readonly Thread: readonly [CT.AnnouncementThread, CT.PrivateThread, CT.PublicThread];
    readonly Forum: readonly [CT.GuildForum];
    readonly All: readonly [CT.GuildVoice, CT.GuildStageVoice, CT.GuildCategory, CT.GuildText, CT.GuildAnnouncement, CT.AnnouncementThread, CT.PrivateThread, CT.PublicThread, CT.GuildForum];
};
declare const ArgType: {
    readonly Channel: {
        readonly Voice: readonly [CT.GuildVoice];
        readonly Stage: readonly [CT.GuildStageVoice];
        readonly Category: readonly [CT.GuildCategory];
        readonly Text: readonly [CT.GuildText];
        readonly Announcement: readonly [CT.GuildAnnouncement];
        readonly Thread: readonly [CT.AnnouncementThread, CT.PrivateThread, CT.PublicThread];
        readonly Forum: readonly [CT.GuildForum];
        readonly All: readonly [CT.GuildVoice, CT.GuildStageVoice, CT.GuildCategory, CT.GuildText, CT.GuildAnnouncement, CT.AnnouncementThread, CT.PrivateThread, CT.PublicThread, CT.GuildForum];
    };
    readonly String: "string";
    readonly User: "user";
    readonly Bool: "boolean";
    readonly Role: "role";
    readonly Mention: "mention";
    readonly Float: "number";
    readonly Int: "integer";
    readonly File: "attachment";
    readonly Unknown: "unknown";
};
declare const SubType: {
    readonly Subcommand: "subcommand";
    readonly Subgroup: "subgroup";
    readonly Hybrid: "both";
    readonly Unknown: "unknown";
};
declare class ArgTypeUtil {
    static get(value: string | readonly CT[]): "string" | "number" | "boolean" | "user" | "role" | "mention" | "integer" | "attachment" | "unknown" | readonly CT[];
    static isNumeric(value: string | readonly CT[]): boolean;
    static asPrimitive(value: string | readonly CT[]): "string" | "number" | "boolean" | "user" | "role" | "mention" | "integer" | "attachment" | "unknown" | readonly CT[];
    static isChannel(value: string | readonly CT[]): boolean;
    static choiceTypes(): ("string" | "number" | "integer")[];
    static isChoiceType(choice: any): boolean;
}
declare class SubTypeUtil {
    static getType(subgroup?: string, subcommand?: string): "unknown" | "subcommand" | "subgroup" | "both";
}
type CrossfishPermissions = PermissionResolvable;
type CrossfishLocalizations = LocalizationMap & {
    "default": string | null | undefined;
};
type CrossfishAutocompleteAction = (interaction: AutocompleteInteraction) => any;
type CrossfishCommandAction = (interaction: ChatInputCommandInteraction) => any;
interface CrossfishDoc {
    [argumentName: string]: string | LocalizationMap;
}
interface CrossfishDocMap {
    [commandName: string]: CrossfishDoc;
}
interface CrossfishAutocompleteActionMap {
    [argumentName: string]: CrossfishAutocompleteAction;
}
interface CrossfishCommandActionMap {
    [subcommandName: string]: CrossfishCommandAction;
    DEFAULT: CrossfishCommandAction;
}
interface RawArgumentData {
    name?: string;
    description?: string;
    type?: string;
    optional?: boolean;
    subcommand?: string;
    subgroup?: string;
    choices?: string[] | number[];
    max?: number;
    min?: number;
    maxLength?: number;
    minLength?: number;
}
interface CommandData {
    subs: Map<string, SlashCommandSubcommandBuilder | SlashCommandSubcommandGroupBuilder | SlashCommandStringOption>;
    autoComplete: Map<string, CrossfishAutocompleteAction>;
    requires: {
        perms: Set<CrossfishPermissions>;
        roles: Set<string>;
    };
    channels: Set<string>;
    guilds: Set<string>;
    docs?: CrossfishDoc;
    action: CrossfishCommandAction;
    JSON?: RESTPostAPIChatInputApplicationCommandsJSONBody;
}
interface Command {
    data: CommandData;
    builder: SlashCommandBuilder;
    docs(json: string | CrossfishDocMap): Command;
    arguments(...args: string[] | string[][]): Command;
    requires(...permsOrRoles: string[] | string[][]): Command;
    channels(...channels: string[] | string[][]): Command;
    guilds(...guilds: string[] | string[][]): Command;
    allowDM(enabled: boolean): Command;
    nsfw(): Command;
    autocomplete(methods: CrossfishAutocompleteActionMap): Command;
    action(method: CrossfishCommandAction | CrossfishCommandActionMap): void;
}
interface PartialArgument {
    name: string;
    type: string;
    sub: boolean;
    choices?: any[];
    max?: number;
    min?: number;
    maxLength?: number;
    minLength?: number;
    autoComplete?: boolean;
}
interface Argument extends PartialArgument {
    subgroup?: boolean;
    subcommand?: boolean;
}
interface BaseClientOptions extends ClientOptions {
    guilds?: string[];
    errors?: {
        Perms?: string;
        Roles?: string;
        Channel?: string;
        Execution?: string;
    };
    path?: string;
}
interface ExistingClientOptions extends BaseClientOptions {
    client: Client;
}
interface NewClientOptions extends BaseClientOptions {
    token: string;
}
export { BaseClientOptions, ExistingClientOptions, NewClientOptions, ChannelType, ArgType, SubType, ArgTypeUtil, SubTypeUtil, PartialArgument, Argument, Command, CommandData, CrossfishPermissions, CrossfishDoc, CrossfishDocMap, RawArgumentData, CrossfishLocalizations, CrossfishAutocompleteActionMap, CrossfishCommandAction, CrossfishAutocompleteAction, CrossfishCommandActionMap };
