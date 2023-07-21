
import {
    ContextMenuCommandBuilder,
    PermissionsBitField,
    MessageContextMenuCommandInteraction,
    UserContextMenuCommandInteraction,
    PermissionResolvable,
    ApplicationCommandType
} from "discord.js";
import { ContextMenuCommand, ContextMenuCommandData, CrossfishPermissions, CrossfishMessageContextMenuAction, CrossfishUserContextMenuAction, MessageContextMenuCommand, UserContextMenuCommand } from "../types.js";
import CrossfishHandler from "../handler.js";
import ErrorUtil from "../errors.js";

class CrossfishContextMenu implements ContextMenuCommand {

    /**
     * @private
     */
    builder = new ContextMenuCommandBuilder();

    /**
     * @private
     */
    data = {
        requires: {
            perms: new Set<CrossfishPermissions>(),
            roles: new Set<string>()
        },
        guilds: new Set<string>(),
        action: (interaction: MessageContextMenuCommandInteraction|UserContextMenuCommandInteraction) => {},
        JSON: undefined
    } as ContextMenuCommandData

    constructor(name: string) {
        ErrorUtil.noexist(name, "Context menu name was not provided");
        ErrorUtil.badtype(name, "string", "context menu name");
        ErrorUtil.minmax(name.length, "context menu name length", 1, 32);
        ErrorUtil.badname(name, "context menu");

        this.builder.setName(name);
    }

    message() : MessageContextMenuCommand {
        this.builder.setType(ApplicationCommandType.Message);
        return this;
    }

    user() : UserContextMenuCommand {
        this.builder.setType(ApplicationCommandType.User);
        return this;
    }

    /**
     * Adds one or more required permissions or roles to the command at once.
     * Specify role names/IDs starting with "@" (e.g. "@Mod"), and perm names without it (e.g. "Administrator").
     */
    requires(...permsOrRoles: string[]|string[][]) : CrossfishContextMenu {
        ErrorUtil.noexist(permsOrRoles, "Permissions or roles were not provided");

        const req = (permOrRole: string|CrossfishPermissions) => {
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
        };

        permsOrRoles = permsOrRoles.flat(1);
        permsOrRoles.forEach(permOrRole => req(permOrRole));
        return this;
    }

    /**
     * Defines one or more guilds that the command can be used in.
     * Do not use this method if you want the command to be published to every guild it is in.
     */
    guilds(...guilds: string[]|string[][]) : CrossfishContextMenu {
        ErrorUtil.noexist(guilds, "Guilds were not provided");

        const g = (guild: string) => {
            ErrorUtil.noexist(guild, "Guild ID was not provided");
            ErrorUtil.badtype(guild, "string", "guild ID");
    
            this.data.guilds.add(guild);
            return this;
        };

        guilds = guilds.flat(1);
        guilds.forEach(guild => g(guild));
        return this;
    }

    /**
     * Sets whether use of this command in DMs is enabled when globally published.
     */
    allowDM(enabled = true) : CrossfishContextMenu {
        ErrorUtil.badtype(enabled, "boolean", "allow DM argument");
        ErrorUtil.pred(() => !!this.data.guilds.size, "Cannot enable DM permission on guild command");

        this.builder.setDMPermission(enabled);
        return this;
    }

    action(method: CrossfishUserContextMenuAction | CrossfishMessageContextMenuAction) {
        ErrorUtil.noexist(method, "Command action was not provided");
        ErrorUtil.badtype(method, "function", "context menu action");

        this.data.action = (interaction: MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction) => {
            if (interaction instanceof MessageContextMenuCommandInteraction) (method as CrossfishMessageContextMenuAction)(interaction, interaction.targetMessage);
            else (method as CrossfishUserContextMenuAction)(interaction, interaction.targetUser);
        };
        return this.build();
    }

    /**
     * @private
     */
    build() {
        // Build command

        this.data.JSON = this.builder.toJSON();
        CrossfishHandler.setCommand(this.data.JSON.name, this as ContextMenuCommand);
    }
}

export default CrossfishContextMenu;