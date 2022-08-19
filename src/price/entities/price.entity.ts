import { DataDefinitions } from "src/data/DataDefinitions";
import { Trade } from "./trade.entity";

var helpers: DataDefinitions = new DataDefinitions();

/**
 * Record that contains the name of the exchange with associated exchange markets.
 */
export class Price {
    /**
     * Two currencies being traded.
     */
    market: string;

    /**
     * Price for the trade.
     */
    price: number = helpers.cryptoNumberFormat(0.00000000);

    /**
     * Lowest price for the market in the time range.
     */
    lowPrice: number = helpers.cryptoNumberFormat(0.00000000);

    /**
     * Highest price for the market in the time range.
     */
    highPrice: number = helpers.cryptoNumberFormat(0.00000000);

    /**
     * Amount of the currency purchased in the time range.
     */
    buyVolume: number = helpers.cryptoNumberFormat(0.00000000);

    /**
     * Amount of currency sold in the time range.
     */
    sellVolume: number = helpers.cryptoNumberFormat(0.00000000);

    /**
     * Total amount of currency bought and sold.
     */
    volume: number = helpers.cryptoNumberFormat(0.00000000);

    public constructor(market: string) {
        this.market = market;
    }

    /**
     * Update the price with the given trade information.
     * @param trade Trade to update price information from.
     */
    public updateTrade(trade: Trade): Price {
        if (trade !== undefined) {
            try {
                this.price = trade.price;
                this.updateHighLowPrice(helpers.cryptoNumberFormat(trade.price));

                if (trade.isBuyerMaker) {
                    this.buyVolume = this.buyVolume + helpers.cryptoNumberFormat(trade.quantity);
                } else {
                    this.sellVolume = this.sellVolume + helpers.cryptoNumberFormat(trade.quantity);
                }

                this.volume = this.buyVolume + this.sellVolume;
            } catch (error) {
                console.log(error);
            } finally {
                return this;
            }
        }
    }

    /**
     * Update the price, lowPrice, highPrice, buyVolume, sellVolume, and volume information from the provided price.
     * @param price Update the price record with the given price.
     */
    public updatePrice(price: Price): Price {
        if (price !== undefined) {
            this.updatePriceData(price.price, price.lowPrice, price.highPrice, price.buyVolume, price.sellVolume);
        }

        return this;
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
    public updatePriceData(price: number, lowPrice: number, highPrice: number, buyVolume: number, sellVolume: number): Price {
        this.price = helpers.cryptoNumberFormat(price);

        this.updateHighLowPrice(lowPrice);
        this.updateHighLowPrice(highPrice);

        this.buyVolume = helpers.cryptoNumberFormat(this.buyVolume) + helpers.cryptoNumberFormat(buyVolume);
        this.sellVolume = helpers.cryptoNumberFormat(this.sellVolume) + helpers.cryptoNumberFormat(sellVolume);
        this.volume = this.buyVolume + this.sellVolume;

        return this;
    }

    private updateHighLowPrice(price: number) {
        if (price < this.lowPrice || this.lowPrice === 0) {
            this.lowPrice = price;
        } else if (price > this.highPrice) {
            this.highPrice = price;
        }
    }
}
