import { Price } from 'src/price/entities/price.entity';

var priceRecord: Price;

/**
 * Record that contains the name of the exchange with associated exchange markets.
 */
export class Market {
    /**
     * Two currencies being traded.
     * @example BTC-USD
     */
    public market: string = "";

    /**
     * Price indicator based on the current price in the given time range.
     * @example 10.0
     */
    public pricePercentage: number = 0;

    /**
     * Price indicator recommendation on Buy, Sell, and Hold based on the current price in the given time range.
     * @example Sell
     */
    public priceLabel: string = "Hold";

    /**
     * Current market price.
     * @example 10000.00000000
     */
    public price: number = 0;

    /**
     * Lowest price in the given time range.
     * @example 9000.00000000
     */
    public lowPrice: number = 0;

    /**
     * Highest price in the given time range.
     * @example 11000.00000000
     */
    public highPrice: number = 0;

    /**
     * Amount of currency bought in the given time range.
     * @example 2.43560000
     */
    public buyVolume: number = 0;

    /**
     * Amount of currency sold in the given time range.
     * @example 1.21500000
     */
    public sellVolume: number = 0;

    /**
     * Total amount bought and sold in the given time range.
     * @example 3.65060000
     */
    public volume: number = 0;

    constructor(price: Price) {

        if (price !== undefined) {
            this.market = price.market;
            priceRecord = price;

            this.updatePrice(price.price, price.lowPrice, price.highPrice, price.buyVolume, price.sellVolume);
        }
    }

    /**
     * Update the record price information.
     * @param price Current market price.
     * @param lowPrice Lowest market price in the time frame.
     * @param highPrice Highest market price in the time frame.
     * @param buyVolume Volume for buying the market currency.
     * @param sellVolume Volume for selling the market currency.
     * @returns Market update with the given price information.
     */
    public updatePrice(price: number, lowPrice: number, highPrice: number, buyVolume: number, sellVolume: number): Market {
        if (priceRecord !== undefined) {
            priceRecord.updatePriceData(price, lowPrice, highPrice, buyVolume, sellVolume);
        } else {
            priceRecord = new Price(this.market).updatePriceData(price, lowPrice, highPrice, buyVolume, sellVolume);
        }

        this.price = priceRecord.price;
        this.lowPrice = priceRecord.lowPrice;
        this.highPrice = priceRecord.highPrice;
        this.buyVolume = priceRecord.buyVolume;
        this.sellVolume = priceRecord.sellVolume;
        this.volume = priceRecord.volume;

        this.updatePriceIndicator(priceRecord);

        return this;
    }

    /**
     * Update the current market price.
     * @param currentPrice Price to update the market price with.
     */
    public updateCurrentPrice(currentPrice: number) {
        this.price = currentPrice;
    }

    /**
     * Update the price, lowPrice, highPrice, buyVolume, sellVolume, and volume, priceLabel, and pricePercentage information from the provided price.
     * @param price Price to update existing record for.
     */
    private updatePriceIndicator(price: Price) {
        try {
            if (price !== undefined) {
                var avgPrice = this.highPrice + this.lowPrice;
                var priceGap = (this.highPrice - this.lowPrice) / 5;
                var lowPercentage = ((this.price / this.lowPrice) - 1) * 100;
                var highPercentage = (this.price / this.highPrice) * 100;

                if (this.lowPrice === this.highPrice) {
                    this.priceLabel = "Hold";
                    this.pricePercentage = 0.0;
                }
                else if (this.price <= this.lowPrice + priceGap) {
                    this.priceLabel = "Strong Buy";
                    this.pricePercentage = lowPercentage;
                } else if (this.price <= this.lowPrice + (priceGap * 2)) {
                    this.priceLabel = "Buy";
                    this.pricePercentage = lowPercentage;
                } else if (this.price <= this.lowPrice + (priceGap * 3)) {
                    this.priceLabel = "Hold";
                    if (this.price < avgPrice) {
                        this.pricePercentage = lowPercentage;
                    } else {
                        this.pricePercentage = highPercentage;
                    }
                } else if (this.price <= this.lowPrice + (priceGap * 4)) {
                    this.priceLabel = "Sell";
                    this.pricePercentage = highPercentage;
                } else {
                    this.priceLabel = "Strong Sell";
                    this.pricePercentage = highPercentage;
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
}
