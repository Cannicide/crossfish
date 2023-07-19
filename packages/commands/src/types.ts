import { ChannelType as CT, RESTPostAPIChatInputApplicationCommandsJSONBody, LocalizationMap } from "discord-api-types/v10";
import { AutocompleteInteraction, ChatInputCommandInteraction, Client, ClientOptions, PermissionResolvable, SlashCommandBuilder, SlashCommandStringOption, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js";

const ChannelType = {
    Voice: [CT.GuildVoice],
    Stage: [CT.GuildStageVoice],
    Category: [CT.GuildCategory],
    Text: [CT.GuildText],
    Announcement: [CT.GuildAnnouncement],
    Thread: [CT.AnnouncementThread, CT.PrivateThread, CT.PublicThread],
    Forum: [CT.GuildForum],
    All: [
        CT.GuildVoice,
        CT.GuildStageVoice,
        CT.GuildCategory,
        CT.GuildText,
        CT.GuildAnnouncement,
        CT.AnnouncementThread,
        CT.PrivateThread,
        CT.PublicThread,
        CT.GuildForum
    ]
} as const;

const ArgType = {
    Channel: ChannelType,
    String: "string",
    User: "user",
    Bool: "boolean",
    Role: "role",
    Mention: "mention",
    Float: "number",
    Int: "integer",
    File: "attachment",
    Unknown: "unknown"
} as const;

const SubType = {
    Subcommand: "subcommand",
    Subgroup: "subgroup",
    Hybrid: "both",
    Unknown: "unknown"
} as const;

class ArgTypeUtil {
    static get(value: string | readonly CT[]) {
        if (typeof value !== "string") return value;

        value = value.replace(/[^a-zA-Z]/g, "").toLowerCase().trim();
        if (value.endsWith("s")) value = value.slice(0, -1);

        if (value.endsWith("channel")) {
            switch (value.replace("channel", "")) {
                case "":
                case "all":
                    return ChannelType.All;
                case "voice":
                case "vc":
                    return ChannelType.Voice;
                case "stage":
                    return ChannelType.Stage;
                case "category":
                case "cat":
                    return ChannelType.Category;
                case "thread":
                    return ChannelType.Thread;
                case "announcement":
                case "announcements":
                    return ChannelType.Announcement;
                case "forum":
                case "forums":
                    return ChannelType.Forum;
                case "text":
                case "default":
                default:
                    return ChannelType.Text;
            }
        }
        else if (value == "user") return ArgType.User;
        else if (["boolean", "bool"].includes(value)) return ArgType.Bool;
        else if (value == "role") return ArgType.Role;
        else if (["mention", "mentionable"].includes(value)) return ArgType.Mention;
        else if (["num", "number", "float"].includes(value)) return ArgType.Float;
        else if (["int", "integer", "intg"].includes(value)) return ArgType.Int;
        else if (["attachment", "file", "image"].includes(value)) return ArgType.File;
        else if (["string", "str"].includes(value)) return ArgType.String;

        return ArgType.Unknown;
    }

    static isNumeric(value: string | readonly CT[]) {
        const key = this.get(value);
        return key == ArgType.Float || key == ArgType.Int;
    }

    static asPrimitive(value: string | readonly CT[]) {
        switch (this.get(value)) {
            case ArgType.User:
            case ArgType.Role:
            case ArgType.Mention:
            case ArgType.File:
            case ChannelType.All:
                return "string";
            case ArgType.Int:
                return "number";
            default:
                return this.get(value);
        }
    }

    static isChannel(value: string | readonly CT[]) {
        const key = this.get(value);
        return Array.isArray(key);
    }

    static choiceTypes() {
        return [ ArgType.String, ArgType.Float, ArgType.Int ];
    }

    static isChoiceType(choice: any) {
        if (typeof choice === "string" || typeof choice === "number") return true;
        return false;
    }
}

class SubTypeUtil {
    static getType(subgroup?: string, subcommand?: string) {
        if (subgroup && subcommand) return SubType.Hybrid;
        if (subcommand) return SubType.Subcommand;
        if (subgroup) return SubType.Subgroup;
        return SubType.Unknown;
    }
}

type CrossfishPermissions = PermissionResolvable;
type CrossfishLocalizations = LocalizationMap & { "default": string | null | undefined };
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
    choices?: string[]|number[];
    max?: number;
    min?: number;
    maxLength?: number;
    minLength?: number;
}

interface CommandData {
    subs: Map<string, SlashCommandSubcommandBuilder|SlashCommandSubcommandGroupBuilder|SlashCommandStringOption>;
    autoComplete: Map<string, CrossfishAutocompleteAction>;
    requires: {
        perms: Set<CrossfishPermissions>,
        roles: Set<string>
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
    docs(json: string|CrossfishDocMap) : Command;
    arguments(...args: string[]|string[][]) : Command;
    requires(...permsOrRoles: string[]|string[][]) : Command;
    channels(...channels: string[]|string[][]) : Command;
    guilds(...guilds: string[]|string[][]) : Command;
    allowDM(enabled: boolean) : Command;
    nsfw() : Command;
    autocomplete(methods: CrossfishAutocompleteActionMap) : Command;
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
};

interface BaseClientOptions extends ClientOptions {
    guilds?: string[];
    errors?: {
        Perms?: string,
        Roles?: string,
        Channel?: string,
        Execution?: string
    };
    path?: string;
    debug?: boolean;
}

interface ExistingClientOptions extends BaseClientOptions {
    client: Client
}

interface NewClientOptions extends BaseClientOptions {
    token: string
}

export { BaseClientOptions, ExistingClientOptions, NewClientOptions, ChannelType, ArgType, SubType, ArgTypeUtil, SubTypeUtil, PartialArgument, Argument, Command, CommandData, CrossfishPermissions, CrossfishDoc, CrossfishDocMap, RawArgumentData, CrossfishLocalizations, CrossfishAutocompleteActionMap, CrossfishCommandAction, CrossfishAutocompleteAction, CrossfishCommandActionMap }