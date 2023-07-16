import { Collection, Client, Guild } from "discord.js";
import { Command } from "./types.js";
declare class CrossfishHandler {
    #private;
    static initialized: boolean;
    static client: Client;
    static Errors: {
        Channel: string;
        Perms: string;
        Roles: string;
        Execution: string;
    };
    static size(): number;
    static initialize(client: Client, debug: boolean): Promise<void>;
    static debugGuilds(testGuilds: string[]): void;
    static getCommand(commandName: string): Command | null;
    static setCommand(commandName: string, command: Command): Promise<void>;
    static debug(...m: any[]): void;
    static getGuilds(...ids: string[] | string[][]): Collection<string, Guild>;
    static initializeAutocomplete(): void;
    static initializeCommands(): Promise<true>;
    static postInitializeCommand(command: Command): Promise<void>;
}
export default CrossfishHandler;
