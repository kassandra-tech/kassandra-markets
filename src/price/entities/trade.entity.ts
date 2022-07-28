import { CurrentPrice } from "./current.price.entity";

/**
 * Record that contains the name of the exchange with associated exchange markets.
 */
export class Trade extends CurrentPrice {
    /**
     * Price for the trade.
     * @example 0.00001250 
     */
    price: number;

    /**
     * Amount traded.
     * @example 0.01240000
     */
    quantity: number;

    /**
     * Was the order a buy order?
     * @example true
     */
    isBuyerMaker: boolean;

    /**
     * Time of the trade.
     * @example 1658954273792
     */
    tradeTime: number;

    public constructor(market: string, trade: Trade, amount: number, isBuy: boolean, time: number) {
        super(market, trade);

        this.price = trade.price;
        this.quantity = amount;
        this.isBuyerMaker = isBuy;
        this.tradeTime = time;
    }
}
