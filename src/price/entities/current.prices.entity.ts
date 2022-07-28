import { Exchanges } from "src/enums/exchanges.enum";
import { CurrentPrice } from "./current.price.entity";

/**
 * Record that contains the name of the exchange with associated exchange markets.
 */
export class CurrentPrices {
    /**
     * Exchange hosting the market.
     * @example Binance
     */
    exchange: Exchanges;

    /**
     * Markets supported by the exchange.
     */
    prices: CurrentPrice[];

    public constructor(exchange: Exchanges, prices: CurrentPrice[]) {
        this.exchange = exchange;
        this.prices = prices;
    }
}
