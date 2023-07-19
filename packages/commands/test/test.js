// TODO: more tests

// Load .env for testing
import { config } from "dotenv";
config({ path: "./test/.env" });



// ====== @crossfish/commands example ======

import handler, { utils, command } from "../lib/index.js";

// Create handler:

const client = handler({
    token: process.env.DISCORD_TOKEN,
    intents: utils.allIntents(),
    guilds: ["668485643487412234"]
});

// Inform us that the bot is ready:
client.on("ready", () => {
    console.log("Crossfish test bot is ready!");
});

// Create a simple command:

command("ping", "A simple ping command for Crossfish.")
.action(i => {
    i.reply("Pong!");
});