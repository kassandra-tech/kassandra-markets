import { Exchanges } from "src/enums/exchanges.enum";
import { ExchangeMarket } from "src/markets/entities/exchange.market.entity";
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

    /**
     * Sort the given markets by market name.
     * @param markets ExchangeMarkets to sort.
     * @returns sorted ExchangeMarkets.
     */
    public sortByExchangeMarket(markets: ExchangeMarket[]): ExchangeMarket[] {
        markets.sort((market1, market2) => (market1.market > market2.market) ? 1 : -1)

        return markets;
    }

    /**
     * Combine two ExchangeMarket objects and return sorted ExchangeMarkets by market name.
     * @param originalMarkets ExchangeMarkets to update with newMarkets.
     * @param newMarkets ExchangeMarkets to check against the originalMarkets.
     * @returns Sorted combined ExchangeMarkets.
     */
    public updateExchangeMarkets(originalMarkets: ExchangeMarket[], newMarkets: ExchangeMarket[]): ExchangeMarket[] {
        newMarkets.forEach(market => {
            if (!originalMarkets.includes(market)) {
                originalMarkets.push(market);
            }
        })

        originalMarkets = this.sortByExchangeMarket(originalMarkets);

        return originalMarkets;
    }

    /**
     * Get the currency or quote currency from the market.
     * @param market Market symbol containing 'currency'-'quote currency'. 
     * @param isCurrency When isCurrency is true, the currency will be returned, when false, the quote currency will be returned.
     * @returns Requested currency from the given market.
     */
    public getCurrencyFromMarket(market: string, isCurrency: boolean = true) {
        const splitChar = '-';

        if (market != "" && market.includes(splitChar)) {
            return isCurrency ? market.split(splitChar)[0] : market.split(splitChar)[1];
        }
    }
}
