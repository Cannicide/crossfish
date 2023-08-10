import { Config } from "./config.js";

Config.load();
console.log(JSON.stringify(Config.eco, null, "\t"));