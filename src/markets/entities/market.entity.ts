import { Base } from 'src/data/Base';
import { Price } from 'src/price/entities/price.entity';

var priceRecord: Price;
var helpers: Base = new Base();

/**
 * Record that contains the name of the exchange with associated exchange markets.
 */
export class Market {
    /**
     * Two currencies being traded.
     * @example BTC-USD
     */
    public market: string = "";
    public pricePercentage: number = 0;
    public priceLabel: string = "Hold";
    public price: number = 0;
    public lowPrice: number = 0;
    public highPrice: number = 0;
    public buyVolume: number = 0;
    public sellVolume: number = 0;
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
