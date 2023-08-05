import { User } from "djs.14";

class CrossfishUser {

    original: User;

    constructor(user: User) {
        this.original = user;
    }

    /*
        Properties:
        TODO: accentColor
        TODO: avatarHash (changed)
        TODO: accentHexColor (changed)
        TODO: avatarURL (converted to prop)
        TODO: banner
        TODO: bannerURL (converted to prop)
        TODO: bot
        TODO: client
        TODO: createdDate (changed)
        TODO: createdTimestamp
        TODO: defaultAvatarURL
        TODO: discriminator (deprecated)
        TODO: displayAvatarURL (converted to prop)
        TODO: dmChannel
        TODO: flags
        TODO: id
        TODO: partial
        TODO: system
        TODO: tag (deprecated)
        TODO: username
    */

    /*
        Methods:
        TODO: createDM
        TODO: deleteDM
        TODO: dynamicAvatarURL (added)
        TODO: dynamicBannerURL (added)
        TODO: equals
        TODO: fetch
        TODO: fetchFlags
        TODO: inGuild (added)
        TODO: sendDM (changed)
        TODO: toMention (added)
        TODO: toString
    */
    
};

// TODO: allow all fields to support both async and sync

export function user(user: User) {
    return new CrossfishUser(user);
}