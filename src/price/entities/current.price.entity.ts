import { Trade } from "./trade.entity";

/**
 * Record that contains the name of the exchange with associated exchange markets.
 */
export class CurrentPrice {
    /**
     * Name of the market.
     * @example BTC-USD
     */
    market: string;

    /**
     * Time of the trade.
     * @example 1658954273792
     */
    time: number;

    /**
     * Price for the trade.
     * @example 25000.00000000
     */
    price: number;

    public constructor(market: string, trade: Trade) {
        this.market = market;
        
        this.updatePrice(trade);
    }

    /**
     * Update the time and price of the current price.
     * @param trade Trade to update time and price for the current price.
     */
    public updatePrice(trade: Trade) {
        try {
            this.time = trade.tradeTime;
            this.price = trade.price;
        } catch (error) {
            console.log(error);
        }
    }
}
