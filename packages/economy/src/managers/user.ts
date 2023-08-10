import { BaseManager } from "./base.js";
import { User } from "../models/user.js";

export class UserManager extends BaseManager<User> {
    constructor(model: User) {
        super(model);
    }

    static from(userId: string, guildId: string) {
        
    }
}