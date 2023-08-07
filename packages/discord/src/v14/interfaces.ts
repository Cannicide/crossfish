import {
    BufferResolvable, 
    Snowflake, 
    EmbedBuilder, 
    AttachmentBuilder, 
    ComponentType, 
    ButtonStyle, 
    TextInputStyle,
    APIActionRowComponent as ActionRowOptions,
    APIButtonComponent as ButtonOptions,
    APISelectMenuComponent as SelectMenuOptions,
    APITextInputComponent as TextInputOptions
} from "djs.14";

export interface ProfileImageOptions {
    format?: "webp" | "png" | "jpg" | "jpeg" | "gif";
    size?: 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;
    dynamic?: boolean;
}

export interface EmbedImageOptions {
    url: string;
    proxy_url?: string;
    height?: number;
    width?: number;
};

export interface MessageEmbed {
    title?: string;
    description?: string;
    url?: string;
    timestamp?: string;
    color?: number;
    fields?: {
        name: string;
        value: string;
        inline?: boolean;
    }[];
    author?: {
        name: string;
        url?: string;
        icon_url?: string;
        proxy_icon_url?: string;
    };
    thumbnail?: EmbedImageOptions;
    image?: EmbedImageOptions;
    video?: EmbedImageOptions;
    footer?: {
        text: string;
        icon_url?: string;
        proxy_icon_url?: string;
    };
}

export interface FileOptions {
    attachment: BufferResolvable;
    name?: string;
    description?: string;
}

export interface EmojiOptions {
    name: string;
    id?: Snowflake;
    animated?: boolean;
};

export interface ComponentOptions {
    type: ComponentType|string;
}

export interface MessageOptions {
    tts?: boolean;
    nonce?: string;
    content?: string;
    embeds?: MessageEmbed[];
    allowed_mentions?: {
        parse?: ("roles" | "users" | "everyone")[];
        roles?: Snowflake[];
        users?: Snowflake[];
        replied_user?: boolean;
    };
    files?: (FileOptions | BufferResolvable | AttachmentBuilder)[];
    components?: ActionRowOptions<ButtonOptions | SelectMenuOptions>[];
    attachments?: AttachmentBuilder[];
}

// Export used djs-version-specific builders, enums, and types here:
export { EmbedBuilder, AttachmentBuilder, ComponentType, ButtonStyle, TextInputStyle, ActionRowOptions, ButtonOptions, SelectMenuOptions, TextInputOptions };