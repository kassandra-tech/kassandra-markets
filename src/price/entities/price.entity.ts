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
                this.updateHighLowPrice(Data.cryptoNumberFormat(trade.price));

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
     * Update the price, lowPrice, highPrice, buyVolume, sellVolume, and volume information from the provided price.
     * @param price Update the price record with the given price.
     */
    public updatePrice(price: Price) {
        if (price !== undefined) {
            this.updatePriceData(price.price, price.lowPrice, price.highPrice, price.buyVolume, price.sellVolume, price.volume);
        }
    }

    /**
     * Update the price, lowPrice, highPrice, buyVolume, sellVolume, and volume information from the provided data.
     * @param price Price for the trade.
     * @param lowPrice Lowest price for the market in the time range.
     * @param highPrice Highest price for the market in the time range.
     * @param buyVolume Amount of the currency purchased in the time range.
     * @param sellVolume Amount of currency sold in the time range.
     * @param volume Total amount of currency bought and sold.
     */
    public updatePriceData(price: number, lowPrice: number, highPrice: number, buyVolume: number, sellVolume: number, volume: number) {
        this.price = Data.cryptoNumberFormat(price);

        this.updateHighLowPrice(lowPrice);
        this.updateHighLowPrice(highPrice);

        this.buyVolume = this.buyVolume + Data.cryptoNumberFormat(buyVolume);
        this.sellVolume = this.sellVolume + Data.cryptoNumberFormat(sellVolume);
        this.volume = this.buyVolume + this.sellVolume;
    }

    private updateHighLowPrice(price: number) {
        if (price < this.lowPrice || this.lowPrice === 0) {
            this.lowPrice = price;
        } else if (price > this.highPrice) {
            this.highPrice = price;
        }
    }
}
