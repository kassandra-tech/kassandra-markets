import { CurrentPrice } from 'src/price/entities/current.price.entity';
import { Price } from 'src/price/entities/price.entity';
import { Exchanges } from '../../enums/exchanges.enum';
import { ExchangeMarket } from './exchange.market.entity';

/**
 * Record that contains the name of the exchange with associated exchange markets.
 */
export class Market {
    /**
     * Two currencies being traded.
     * @example BTC-USD
     */
    currency: string;
    quoteCurrency: string;
    currencyName: string;
    rank: number;
    rating: string;
    pricePercentage: number;
    priceLabel: string;
    price: Price;
    exchanges: Exchanges[];
    exchangeMarket: ExchangeMarket

    constructor(exchangeMarket: ExchangeMarket,
        currentPrice: CurrentPrice,
        price: Price,
        exchanges: Exchanges[]) {
        this.price = price;
        this.currency = exchangeMarket.currency;
        this.currencyName = exchangeMarket.currencyName;
        this.rank = exchangeMarket.rank;
        this.rating = exchangeMarket.rating;
        this.priceLabel = "";
        this.pricePercentage = 0;

        if (currentPrice !== undefined) {
            this.price.price = currentPrice.price;
        }
        
        this.exchanges = exchanges;

        this.updatePrice(price);
    }

    /**
     * Update the market price with the given price details.
     * @param price Price to update existing record for.
     */
    public updatePrice(price: Price) {
        try {
            if (price.lowPrice < this.price.lowPrice || this.price.lowPrice === 0.0) {
                this.price.lowPrice = price.lowPrice;
            }

            if (price.highPrice > this.price.highPrice) {
                this.price.highPrice = price.highPrice;
            }

            var currentPrice = price.price;
            var lowPrice = price.lowPrice;
            var highPrice = price.highPrice;
            var avgPrice = highPrice + lowPrice;
            var priceGap = (highPrice - lowPrice) / 5;
            var lowPercentage = ((currentPrice / lowPrice) -1) * 100;
            var highPercentage = (currentPrice / highPrice) * 100;

            if (lowPrice === highPrice) {
                this.priceLabel = "Hold";
                this.pricePercentage = 0.0;
            }
            else if (currentPrice <= lowPrice + priceGap) {
                this.priceLabel = "Strong Buy";
                this.pricePercentage = lowPercentage;
            } else if (currentPrice <= lowPrice + (priceGap * 2)) {
                this.priceLabel = "Buy";
                this.pricePercentage = lowPercentage;
            } else if (currentPrice <= lowPrice + (priceGap * 3)) {
                this.priceLabel = "Hold";
                if (currentPrice < avgPrice) {
                    this.pricePercentage = lowPercentage;
                } else {
                    this.pricePercentage = highPercentage;
                }
            } else if (currentPrice <= lowPrice + (priceGap * 4)) {
                this.priceLabel = "Sell";
                this.pricePercentage = highPercentage;
            } else {
                this.priceLabel = "Strong Sell";
                this.pricePercentage = highPercentage;
            }

            this.price.buyVolume = price.buyVolume + this.price.buyVolume;
            this.price.sellVolume = price.sellVolume + this.price.sellVolume;
            this.price.volume = price.volume + this.price.volume;
        } catch (error) {
            console.log(error);
        }
    }
}
