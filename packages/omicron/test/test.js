import { schedule, unschedule } from "../lib/index.js";

let counterA = 0;
schedule("*/1 * * * * *", id => {
    console.log("1 Second Passed!");
    counterA++;

    if (counterA == 5) {
        console.log("Canceling...");
        unschedule(id);
    }
});

const date = new Date();
date.setMinutes(date.getMinutes() + 1);
schedule(date, () => {
    console.log("Date reached!");
});

schedule(new Date(), () => {
    console.log("This executes immediately!");
});