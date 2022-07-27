/**
 * Record that contains the name of the exchange with associated exchange markets.
 */
 export class Trade {
    /**
     * Price for the trade.
     * @example 0.00001250 
     */
    price: number;

    /**
     * Amount traded.
     * @example 0.01240000
     */
    amount: number;

    /**
     * Was the order a buy order?
     * @example true
     */
    isBuy: boolean;

    /**
     * Time of the trade.
     * @example 1658954273792
     */
    tradeTime: number;

    public constructor(price: number, amount: number, isBuy: boolean, time: number) {
        this.price = price;
        this.amount = amount;
        this.isBuy = isBuy;
        this.tradeTime = time;
    }
}
