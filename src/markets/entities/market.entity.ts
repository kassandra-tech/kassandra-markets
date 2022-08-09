import { DataDefinitions } from 'src/data/DataDefinitions';
import { CurrentPrice } from 'src/price/entities/current.price.entity';
import { Price } from 'src/price/entities/price.entity';
import { Exchanges } from '../../enums/exchanges.enum';
import { ExchangeMarket } from './exchange.market.entity';

var Data = new DataDefinitions();

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

    constructor(exchangeMarket: ExchangeMarket, currentPrice: CurrentPrice, price: Price, exchanges: Exchanges[]) {
        this.currency = exchangeMarket.currency;
        this.currencyName = exchangeMarket.currencyName;
        this.rank = exchangeMarket.rank;
        this.rating = exchangeMarket.rating;
        this.price = price;
        this.priceLabel = "";
        this.pricePercentage = 0.0;
        this.exchanges = exchanges;

        this.updatePrice(price);

        if (currentPrice !== undefined) {
            this.price.price = Data.cryptoNumberFormat(currentPrice.price);
        } else {
            this.price.price = Data.cryptoNumberFormat(price.price);
        }
    }

    /**
     * Update the market price with the given price details.
     * @param price Price to update existing record for.
     */
    public updatePrice(price: Price) {
        try {
            if (price !== undefined) {
                this.price.updatePrice(price);

                var currentPrice = Data.cryptoNumberFormat(price.price);
                var lowPrice = Data.cryptoNumberFormat(price.lowPrice);
                var highPrice = Data.cryptoNumberFormat(price.highPrice);
                var avgPrice = highPrice + lowPrice;
                var priceGap = (highPrice - lowPrice) / 5;
                var lowPercentage = ((currentPrice / lowPrice) - 1) * 100;
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
            }
        } catch (error) {
            console.log(error);
        }
    }
}
