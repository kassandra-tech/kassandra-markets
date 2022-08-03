import { CurrentPrice } from 'src/price/entities/current.price.entity';
import { Price } from 'src/price/entities/price.entity';
import { Exchanges } from '../../enums/exchanges.enum';
import { MarketsData } from '../markets.data';
import { CurrencyInformation } from './currency.information.entity';
import { ExchangeMarket } from './exchange.market.entity';

/**
 * Record that contains the name of the exchange with associated exchange markets.
 */
export class Market {
    /**
     * Two currencies being traded.
     * @example BTC-USD
     */
    market: string;
    currency: string;
    quoteCurrency: string;
    currencyName: string;
    rank: number;
    rating: string;
    price: number;
    lowPrice: number;
    highPrice: number;
    pricePercentage: number;
    priceLabel: string;
    buyVolume: number;
    sellVolume: number;
    volume: number;
    exchanges: Exchanges[];
    exchangeMarket: ExchangeMarket

    constructor(exchangeMarket: ExchangeMarket,
        currentPrice: CurrentPrice,
        price: Price,
        exchanges: Exchanges[]) {
        this.market = exchangeMarket.market;
        this.currency = exchangeMarket.currency;
        this.currencyName = exchangeMarket.currencyName;
        this.rank = exchangeMarket.rank;
        this.rating = exchangeMarket.rating;

        if (currentPrice !== undefined) {
            this.price = currentPrice.price;
        }

        if (price !== undefined) {
            this.lowPrice = price.lowPrice;
            this.highPrice = price.highPrice;
            this.buyVolume = price.buyVolume;
            this.sellVolume = price.sellVolume;
            this.volume = price.volume;
        }

        this.exchanges = exchanges;
    }

    update(price: Price) {
        try {
            if (price.lowPrice < this.lowPrice || this.lowPrice === 0.0) {
                this.lowPrice = price.lowPrice;
            }

            if (price.highPrice > this.highPrice) {
                this.highPrice = price.highPrice;
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

            this.buyVolume = price.buyVolume + this.buyVolume;
            this.sellVolume = price.sellVolume + this.sellVolume;
            this.volume = price.volume + this.volume;
        } catch (error) {
            console.log(error);
        }
    }
}
