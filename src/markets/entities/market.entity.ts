import { Currency } from 'src/currency/entity/currency.entity';
import { CurrentPrice } from 'src/price/entities/current.price.entity';
import { Price } from 'src/price/entities/price.entity';

var Data: Price;

/**
 * Record that contains the name of the exchange with associated exchange markets.
 */
export class Market {
    /**
     * Two currencies being traded.
     * @example BTC-USD
     */
    public market: string;
    public currency: string;
    public currencyName: string;
    public quoteCurrency: string;
    public currencyRank: number;
    public currencyRating: string;
    public pricePercentage: number;
    public priceLabel: string;
    public price: number;
    public lowPrice: number;
    public highPrice: number;
    public buyVolume: number;
    public sellVolume: number;
    public volume: number;

    constructor(currency: Currency, quoteCurrency: string, currentPrice: CurrentPrice, price: Price) {
        if (price !== undefined) {
            Data = price;
            this.market = price.market;

            if (currency !== undefined) {
                this.currency = currency.symbol;
                this.currencyName = currency.name;
                this.currencyRank = currency.rank;
                this.currencyRating = currency.rating;
            }

            this.quoteCurrency = quoteCurrency;

            if (currentPrice !== undefined) {
                this.price = currentPrice.price;
            }
            this.priceLabel = "";
            this.pricePercentage = 0;

            this.updatePrice(price);
        }
    }

    /**
     * Update the price, lowPrice, highPrice, buyVolume, sellVolume, and volume, priceLabel, and pricePercentage information from the provided price.
     * @param price Price to update existing record for.
     */
    public updatePrice(price: Price) {
        try {
            if (price !== undefined) {
                Data.updatePrice(price);

                this.lowPrice = Data.lowPrice;
                this.highPrice = Data.highPrice;
                this.buyVolume = Data.buyVolume;
                this.sellVolume = Data.sellVolume;
                this.volume = Data.volume;

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

    /**
     * Update the market price from another market.
     * @param market Market to update exiting market prices from.
     */
    public updateMarketPrice(market: Market) {
        if (market !== undefined) {
            Data.updatePriceData(market.price, market.lowPrice, market.highPrice, market.buyVolume, market.sellVolume, market.volume);
        }
    }
}
