import { nanoid } from "nanoid";
import cron, { ScheduledTask } from "node-cron";

const tasks = new Map<string, ScheduledTask>();

/**
 * Schedules an Omicron cron job using a String.
 */
export function schedule(cronString: string, callback: (id: string) => any) : string;
/**
 * Schedules an Omicron cron job using a Date object.
 * - Date-checking is performed every minute, so only Dates up to a precise minute are supported.
 */
export function schedule(cronString: Date, callback: (id: string) => any) : string;
export function schedule(cronString: string|Date, callback: (id: string) => any) {
    const id = nanoid();

    if (cronString instanceof Date) {
        const oldCronString = cronString;
        const oldCallback = callback;

        cronString = "*/1 * * * *";
        callback = (ownId) => {
            if (Date.now() >= oldCronString.getTime()) {
                oldCallback(ownId);
                unschedule(ownId);
                return true;
            }
            return false;
        };

        if (callback(id)) return id;
    }

    if (!cron.validate(cronString)) throw new Error("OmicronError: Invalid cron string provided.");

    const task = cron.schedule(cronString, () => callback(id));
    tasks.set(id, task);

    return id;
}

export function job(id: string) {
    return tasks.get(id);
}

export function jobs() {
    return tasks;
}

export function unschedule(id: string) {
    const task = job(id);
    if (task) {
        setTimeout(() => task.stop(), 1);
        tasks.delete(id);
        return true;
    }
    else return false;
}