import { Exchanges } from "src/enums/exchanges.enum";

export class Data {
    /**
     *  Get exchanges for searching data.
     *  When all is in the provided Exchanges all supported exchanges will be searched.
     * @param exchanges Exchanges to search.
     * @returns Exchanges to search.
     */
    public getExchanges(exchanges: Exchanges[]): Exchanges[] {
        var exchangeList: Exchanges[] = [];

        if (exchanges.includes(Exchanges.All)) {
            exchangeList = this.getAllExchanges();
        } else if (Array.isArray(exchanges)) {
            Array.from(exchanges).forEach(exchange => {
                exchangeList.push(exchange);
            })
        } else {
            exchangeList.push(exchanges);
        }

        return exchangeList;
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

    /**
     * Get All supported exchanges.
     * @returns All supported exchanges.
     */
    private getAllExchanges(): Exchanges[] {
        var exchanges: Exchanges[] = [];

        exchanges.push(Exchanges.Binance, Exchanges.Coinbase);

        return exchanges;
    }
}
