import { Exchanges } from "src/enums/exchanges.enum";
import { MarketPrice } from "./market.price.entity";
import { Trade } from "./trade.entity";

/**
 * Record that contains the name of the exchange with associated exchange markets.
 */
export class MarketPrices {
    /**
     * Exchange hosting the market.
     * @example Binance
     */
     exchange: Exchanges;

     /**
      * Markets supported by the exchange.
      */
     prices: MarketPrice[];
 
     public constructor(exchange: Exchanges, prices: MarketPrice[]) {
         this.exchange = exchange;
         this.prices = prices;
     }
}
