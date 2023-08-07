import { Guild, GuildMember, Snowflake } from "djs.14";
import { CrossfishCollection } from "../collection.js";

class CrossfishMember {

    original: GuildMember;

    constructor(member: GuildMember) {
        this.original = member;
    }

    /*
        Properties:

        TODO: avatarHash (changed)
        TODO: avatarURL (converted to prop)
        TODO: bannable
        TODO: boostingSinceDate (changed)
        TODO: boostingSinceTimestamp (changed)
        TODO: client
        TODO: timeoutUntilDate (changed)
        TODO: timeoutUntilTimestamp (changed)
        TODO: displayAvatarURL (converted to prop)
        TODO: displayColor
        TODO: displayHexColor
        TODO: displayName
        TODO: guild
        TODO: id
        TODO: joinedDate (changed)
        TODO: joinedTimestamp
        TODO: kickable
        TODO: manageable
        TODO: moderatable
        TODO: nickname
        TODO: partial
        TODO: pending
        TODO: permissions
        TODO: presence
        TODO: roles
        TODO: user
        TODO: voice
    */

    /*
        Methods:

        TODO: ban
        TODO: createDM
        TODO: deleteDM
        TODO: dynamicAvatarURL (added)
        TODO: edit
        TODO: equals
        TODO: fetch
        TODO: inGuild (added)
        TODO: isBoosting (added)
        TODO: inTimeout (changed)
        TODO: kick
        TODO: permissionsIn
        TODO: sendDM (changed)
        TODO: setNickname
        TODO: timeout
        TODO: timeoutUntil (changed)
        TODO: toMention (added)
        TODO: toString
    */
    
};

export function member(member: GuildMember) {
    return new CrossfishMember(member);
}