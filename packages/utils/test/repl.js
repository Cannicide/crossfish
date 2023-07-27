// @ts-nocheck

import prompt from "prompt";
import { repl, ctx } from "../lib/index.js";

prompt.message = "Crossfish Repl";
prompt.delimiter = "> ";

prompt.start();
const { ["Start Repl?"]: res } = await prompt.get(["Start Repl?"]);

ctx.sublime = "SUBLIMINAL";
if (res.startsWith("y")) repl();