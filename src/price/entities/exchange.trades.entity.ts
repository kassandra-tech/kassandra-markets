import { Exchanges } from "src/enums/exchanges.enum";
import { Trade } from "./trade.entity";

/**
 * Record that contains the name of the exchange with associated exchange markets.
 */
export class ExchangeTrades {
    /**
     * Exchange hosting the market.
     * @example Binance
     */
    exchange: Exchanges;

    /**
     * Markets supported by the exchange.
     */
    markets: Trade[];

    public constructor(exchange: Exchanges, markets: Trade[]) {
        this.exchange = exchange;
        this.markets = markets;
    }
}
