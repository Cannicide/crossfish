import { ChannelType as CT } from "discord-api-types/v10";

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
    Unknown: undefined
} as const;

const SubType = {
    Subcommand: "subcommand",
    Subgroup: "subgroup",
    Hybrid: "both"
} as const;

class ArgTypeUtil {
    static get(value?: string | CT[]) {
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

    static isNumeric(value?: string | CT[]) {
        const key = this.get(value);
        return key == ArgType.Float || key == ArgType.Int;
    }

    static asPrimitive(value?: string | CT[]) {
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

    static isChannel(value?: string | CT[]) {
        const key = this.get(value);
        return Array.isArray(key);
    }

    static choiceTypes() {
        return [ ArgType.String, ArgType.Float, ArgType.Int ];
    }
}

class SubTypeUtil {
    static getType(subgroup?, subcommand?) {
        if (subgroup && subcommand) return SubType.Hybrid;
        if (subcommand) return SubType.Subcommand;
        if (subgroup) return SubType.Subgroup;
    }
}

export { ChannelType, ArgType, SubType, ArgTypeUtil, SubTypeUtil }