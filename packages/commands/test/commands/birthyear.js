// An example 'birthyear' command

import { command } from "../../lib/index.js";

command("birthyear", "Crossfish example to get birth year from age.")
.arguments("[age: 1 < x < 100]")
.action(i => {
    const age = i.options.getInteger("age", false);

    if (!age) i.reply(`You did not specify an age. Using default of 18, you would be born in ${2023 - 18}!`);
    else i.reply(`You were born in ${2023 - age}!`);
});