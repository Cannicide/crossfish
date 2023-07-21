import { contextmenu } from "../../lib/index.js";

contextmenu("Invert Message Content")
.message()
.requires("@Member")
.action((interaction, message) => {
    const reversed = message.content.split("").reverse().join("");
    interaction.reply(`Here's the reversed content: ${reversed}`);
});

contextmenu("Invert User Name")
.user()
.action((interaction, user) => {
    const reversed = user.username.split("").reverse().join("");
    interaction.reply(`Here's the reversed name: ${reversed}`);
});