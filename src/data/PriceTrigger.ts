/**
 * Time helpers to return when data should be updated in the database.
 */
export class PriceTrigger {
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
}
