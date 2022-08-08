import { DataDefinitions } from "src/data/DataDefinitions";
import { Trade } from "./trade.entity";

var Data = new DataDefinitions();

/**
 * Record that contains the name of the exchange with associated exchange markets.
 */
export class Price {

    market: string;

    /**
     * Price for the trade.
     */
    price: number;

    /**
     * Lowest price for the market in the time range.
     */
    lowPrice: number;

    /**
     * Highest price for the market in the time range.
     */
    highPrice: number;

    /**
     * Amount of the currency purchased in the time range.
     */
    buyVolume: number;

    /**
     * Amount of currency sold in the time range.
     */
    sellVolume: number;

    /**
     * Total amount of currency bought and sold.
     */
    volume: number;

    public constructor(market: string, trade: Trade = undefined) {
        this.market = market;

        this.price = Data.cryptoNumberFormat(0.00000000);
        this.lowPrice = Data.cryptoNumberFormat(0.00000000);
        this.highPrice = Data.cryptoNumberFormat(0.00000000);
        this.buyVolume = Data.cryptoNumberFormat(0.00000000);
        this.sellVolume = Data.cryptoNumberFormat(0.00000000);
        this.volume = Data.cryptoNumberFormat(0.00000000);

        if (trade !== undefined) {
            this.price = Data.cryptoNumberFormat(trade.price);
            this.lowPrice = Data.cryptoNumberFormat(trade.price);
            this.highPrice = Data.cryptoNumberFormat(trade.price);

            if (trade.isBuyerMaker) {
                this.buyVolume = Data.cryptoNumberFormat(this.buyVolume + trade.quantity);
            } else {
                this.sellVolume = Data.cryptoNumberFormat(this.sellVolume + trade.quantity);
            }

            this.volume = Data.cryptoNumberFormat(this.volume + trade.quantity);
        }
    }

    public updatePrice(price: Price) {
        try {
            var amount = Data.cryptoNumberFormat(price.volume);

            if (this.lowPrice === 0 || this.highPrice === 0) {
                this.lowPrice = price.lowPrice;
                this.highPrice = price.highPrice;
            } else if (price.lowPrice < this.lowPrice) {
                this.lowPrice = price.lowPrice;
            } else if (price.highPrice > this.highPrice) {
                this.highPrice = price.highPrice;
            }

            this.buyVolume = Data.cryptoNumberFormat(this.buyVolume + price.buyVolume);
            this.sellVolume = Data.cryptoNumberFormat(this.sellVolume + price.sellVolume);
            this.volume = Data.cryptoNumberFormat(this.volume + amount);
        } catch (error) {
            console.log(error);
        }
    }
}
