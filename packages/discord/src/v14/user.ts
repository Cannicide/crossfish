import { Guild, User } from "djs.14";
import { Structure } from "../structure.js";
import { MessageOptions, ProfileImageOptions } from "./interfaces.js";

class CrossfishUser extends Structure<User> {

    /*
        Properties:

        accentColor
        avatarHash (changed)
        accentHexColor (changed)
        avatarURL (converted to prop)
        bannerHash (changed)
        bannerURL (converted to prop)
        bot
        client
        createdDate (changed)
        createdTimestamp
        defaultAvatarURL
        discriminator (deprecated)
        displayAvatarURL (converted to prop)
        dmChannel
        flags
        id
        partial
        system
        tag (deprecated)
        username
    */
    /*
        Methods:
        
        createDM
        deleteDM
        dynamicAvatarURL (added)
        dynamicBannerURL (added)
        equals
        fetch
        fetchFlags
        inGuild (added)
        sendDM (changed)
        toMention (added)
        toString
    */

    get accentColor() {
        return this.wrapper(o => o.accentColor);
    }

    get avatarHash() {
        return this.wrapper(o => o.avatar);
    }

    get accentHexColor() {
        return this.wrapper(o => o.accentColor);
    }
    
    get avatarURL() {
        return this.wrapper(o => o.avatarURL());
    }
    
    get bannerHash() {
        return this.wrapper(o => o.banner);
    }
    
    get bannerURL() {
        return this.wrapper(o => o.bannerURL());
    }
    
    get bot() {
        return this.wrapper(o => o.bot);
    }
    
    get client() {
        return this.wrapper(o => o.client);
    }
    
    get createdDate() {
        return this.wrapper(o => o.createdAt);
    }
    
    get createdTimestamp() {
        return this.wrapper(o => o.createdTimestamp);
    }
    
    get defaultAvatarURL() {
        return this.wrapper(o => o.defaultAvatarURL);
    }
    
    /**
     * @deprecated
     */
    get discriminator() {
        return this.wrapper(o => o.discriminator);
    }
    
    get displayAvatarURL() {
        return this.wrapper(o => o.displayAvatarURL());
    }
    
    get dmChannel() {
        return this.wrapper(o => o.dmChannel);
    }
    
    get flags() {
        return this.wrapper(o => o.flags);
    }
    
    get id() {
        return this.wrapper(o => o.id);
    }
    
    get partial() {
        return this.wrapper(o => o.partial);
    }
    
    get system() {
        return this.wrapper(o => o.system);
    }
    
    /**
     * @deprecated
     */
    get tag() {
        return this.wrapper(o => o.tag);
    }
    
    get username() {
        return this.wrapper(o => o.username);
    }

    createDM() {
        return this.wrapper(o => o.createDM());
    }
    
    deleteDM() {
        return this.wrapper(o => o.deleteDM());
    }
    
    dynamicAvatarURL(options?: ProfileImageOptions) {
        if (options?.format == "gif") {
            options.dynamic = true;
            delete options.format;
        }

        return this.wrapper(o => o.avatarURL(options));
    }
    
    dynamicBannerURL(options?: ProfileImageOptions) {
        if (options?.format == "gif") {
            options.dynamic = true;
            delete options.format;
        }
        
        return this.wrapper(o => o.bannerURL(options));
    }
    
    async equals(user: User|CrossfishUser) {
        if (user instanceof CrossfishUser) {
            await user.init();
            user = user.original!;
        }

        return this.wrapper(o => o.equals(user as User));
    }
    
    fetch() {
        return this.wrapper(o => o.fetch());
    }
    
    fetchFlags() {
        return this.wrapper(o => o.fetchFlags());
    }
    
    inGuild(guild: Guild) { // TODO: add support for CrossfishGuild as well
        return this.wrapper(async o => !!(await guild.members.fetch(o.id)));
    }
    
    sendDM(content: string|MessageOptions) {
        return this.wrapper(o => o.send(content));
    }
    
    toMention() {
        return this.wrapper(o => o.toString());
    }
    
    toString() {
        return this.toMention();
    }

    get [Symbol.toStringTag]() {
        return "CrossfishUser";
    }
    
};

export function user(user: User) {
    return new CrossfishUser(user);
}