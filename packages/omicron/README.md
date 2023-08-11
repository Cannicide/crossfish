# @crossfish/omicron
A lightweight Typescript wrapper for the `node-cron` job scheduler.\
Wraps around `node-cron` for cron job scheduling, with `nanoid` for unique job mapping.

## Features
- Schedule functions to execute regularly using cron notation
- Schedule functions to execute once at a set datetime using Javascript `Date` objects
    - Date-scheduled functions execute if the `Date` has been reached or passed
    - Automatically unschedules the function once executed at the specific `Date`
- Unique IDs assigned to each scheduled function for identification
- Unschedule and cancel currently-scheduled functions
    - Fixes issue in `node-cron` where jobs are unable to be stopped!
- Retrieve `node-cron` task objects (`ScheduledTask`) using their unique IDs, from any file or context
- Fully written in Typescript, eliminating the need to install a types package

## Usage
Install via NPM:
```
npm install @crossfish/omicron
```

Import and use (ESM example):
```js
import { schedule, unschedule } from "@crossfish/omicron";

// === Basic, endlessly repeating example ===

schedule("*/2 * * * * *", id => {
    console.log("2 seconds passed!");
});

// === Unschedule within function after 3 repeats ===

let i = 0;
schedule("*/3 * * * * *", id => {
    console.log("3 seconds passed!");
    
    i++;
    if (i == 3) unschedule(id);
});

// === Unschedule later/elsewhere ===

const taskId = schedule("*/5 * * * * *", () => {
    console.log("5 seconds passed!");
});
// ...
unschedule(taskId);

// === Schedule for specific date ===

schedule(new Date(), () => {
    console.log("This executes immediately!");
});
```

See the documentation of [`node-cron`](https://github.com/node-cron/node-cron#cron-syntax) for all supported components of cron syntax.

## Drawbacks
> ### Date-based scheduling may be around 1 minute off

The Date-based scheduling system only tests if the provided `Date` has been reached or passed once per minute. This also means that using datetimes that represent only a few seconds after the current time will effectively be equivalent to using a Date that is 1 minute away from the current time. In other words, the minimum distance between the current and provided `Date` is 1 minute (unless the provided `Date` is before or exactly equivalent to the current date, in which case the scheduled function will execute immediately as seen in the last usage example above).

*Since `Date` scheduling is usually used for datetimes that are further than 1 minute away from the current time, this should not be a problem for the majority of use cases.*

> ### Omicron has less options than `node-cron`

Omicron does not expose all of the scheduling options that the `node-cron` package does. This is because certain options in the package are known to cause issues such as memory leaks. Omicron avoids using or exposing those options, enabling better performance and safety at the cost of configurability.

## Credits
- Created by **Cannicide#2753**
- [`node-cron`](https://www.npmjs.com/package/node-cron) created by [Merencia](https://www.npmjs.com/~merencia)