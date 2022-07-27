import { Trade } from "./trade.entity";

/**
 * Record that contains the name of the exchange with associated exchange markets.
 */
 export class Price {

    market: string;

    /**
     * Price for the trade.
     */
    price: number;

    lowPrice: number;

    highPrice: number;

    buyVolume: number;

    sellVolume: number;

    volume: number;

    public constructor(market: string, trade: Trade) {
        this.market = market;
        this.lowPrice = trade.price;
        this.highPrice = trade.price;
        this.buyVolume = 0.0;
        this.sellVolume = 0.0;
        this.volume = 0.0;

        this.update(trade);
    }

    /**
     * Update price and volume properties of the market.
     * @param trade Trade to update market price and volume information from.
     */
    public update(trade: Trade) {
        try {
            var price = trade.price;
            var amount = trade.amount;

            if (price < this.lowPrice) {
                this.lowPrice = price;
            } else if (price > this.highPrice) {
                this.highPrice = price;
            }

            if (trade.isBuy) {
                this.buyVolume = this.buyVolume + amount;
            } else {
                this.sellVolume = this.sellVolume + amount;
            }

            this.volume = this.volume + amount;
        } catch (error) {
            console.log(error);
        }
    }
}
