import { Exchanges } from "src/enums/exchanges.enum";
import { DataDefinitions } from "./DataDefinitions";

/**
 * Base class when interfacing with the Kassandra datastore.
 */
export class Base {

    public Definitions = new DataDefinitions();

    /**
     * Get exchanges from the privided Exchanges.
     * When 'All' is in the provided Exchanges all supported exchanges will be searched.
     * @param exchanges Exchanges to search.
     * @returns Exchanges.
     */
     public getExchanges(exchanges: Exchanges[]): Exchanges[] {
        var exchangeList: Exchanges[] = [];

        if (exchanges.includes(Exchanges.All)) { // Add all exchanges
            exchangeList.push(Exchanges.Binance,
                              Exchanges.Coinbase);
        } else if (Array.isArray(exchanges)) { // Add selected exchanges
            exchanges.forEach(exchange => {
                exchangeList.push(exchange);
            })
        } else { // Add single exchange
            exchangeList.push(exchanges);
        }

        return exchangeList;
    }
}
