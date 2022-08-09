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

            this.updateTrade(trade);
        }
    }

    /**
     * Update the price with the given trade information.
     * @param trade Trade to update price information from.
     */
    public updateTrade(trade: Trade) {
        if (trade !== undefined) {
            try {
                this.price = Data.cryptoNumberFormat(trade.price);

                if (this.lowPrice === 0 && this.highPrice === 0) {
                    this.lowPrice = Data.cryptoNumberFormat(trade.price);
                    this.highPrice = Data.cryptoNumberFormat(trade.price);
                } else if (this.price < this.lowPrice) {
                    this.lowPrice = this.price;
                } else if (this.price > this.highPrice) {
                    this.highPrice = this.price;
                }

                if (trade.isBuyerMaker) {
                    this.buyVolume = this.buyVolume + Data.cryptoNumberFormat(trade.quantity);
                } else {
                    this.sellVolume = this.sellVolume + Data.cryptoNumberFormat(trade.quantity);
                }

                this.volume = this.buyVolume + this.sellVolume;
            } catch (error) {
                console.log(error);
            }
        }
    }

    /**
     * Update the price with additional price information.
     * @param price Update the price record with the given price.
     */
    public updatePrice(price: Price) {
        if (price !== undefined) {
            this.price = Data.cryptoNumberFormat(price.price);

            if (price.lowPrice < this.lowPrice) {
                this.lowPrice = Data.cryptoNumberFormat(price.lowPrice);
            } else if (price.highPrice > this.highPrice) {
                this.highPrice = Data.cryptoNumberFormat(price.highPrice);
            }

            this.buyVolume = this.buyVolume + Data.cryptoNumberFormat(price.buyVolume);
            this.sellVolume = this.sellVolume + Data.cryptoNumberFormat(price.sellVolume);
            this.volume = this.buyVolume + Data.cryptoNumberFormat(this.sellVolume);
        }
    }
}
