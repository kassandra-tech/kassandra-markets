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
     * Get All supported exchanges.
     * @returns All supported exchanges.
     */
    private getAllExchanges(): Exchanges[] {
        var exchanges: Exchanges[] = [];

        exchanges.push(Exchanges.Binance, Exchanges.Coinbase);

        return exchanges;
    }
}
