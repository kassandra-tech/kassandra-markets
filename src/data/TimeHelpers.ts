/**
 * Time helpers to return when data should be updated in the database.
 */
export class TimeHelpers {
    private time: Date;

    constructor() {
        this.time = new Date(Date.now());
    }

    /**
     * Return true when the number of seconds has elapsed since the last check. 
     * @param seconds Number of seconds to wait for the condition to be true.
     * @returns True when the number of seconds since the last check has elapsed.
     */
    public secondUpdate(seconds: number = 1): boolean {
        var now = Date.now();

        if (new Date(new Date(now)) > this.time) {
            this.time = new Date((new Date(now).getTime() + (1000 * seconds)));

            return true;
        }

        return false;
    }

    /**
     * Return true when the number of minutes has elapsed since the last check. 
     * @param minutes Number of minutes to wait for the condition to be true.
     * @returns True when the number of minutes since the last check has elapsed.
     */
    public minuteUpdate(minutes: number = 1): boolean {
        var now = Date.now();

        if (new Date(new Date(now)) > this.time) {
            this.time = new Date((new Date(now).getTime() + (1000 * 60 * minutes)));

            return true;
        }

        return false;
    }

    /**
     * Get the number of days before the current time.
     * @param days Number of days before the current time.
     * @returns Time number of days before the current time.
     */
    public getDaysBefore(days: number = 1): Date {
        return new Date((new Date(Date.now()).getTime() - (60 * 60 * 1000 * 24 * days)));
    }

    /**
     * Get the number of minutes before the current time.
     * NOTE: one additional minute is added to account for timing of when records are written to the database.
     * @param minutes 
     * @returns Number of minutes before the current time.
     */
    public getMinutesBefore(minutes: number = 1): Date {
        return new Date((new Date(Date.now()).getTime() - (60 * 1000 * minutes + 1)));
    }
}
