import { Exchanges } from "src/enums/exchanges.enum";
import { Price } from "./price.entity";

/**
 * Record that contains the name of the exchange with associated exchange prices.
 */
export class Prices {
    /**
     * Exchange hosting the market.
     * @example Binance
     */
    exchange: Exchanges;

    /**
     * Market price records.
     */
    prices: Price[];

    public constructor(exchange: Exchanges, prices: Price[]) {
        this.exchange = exchange;
        this.prices = prices;
    }
}
