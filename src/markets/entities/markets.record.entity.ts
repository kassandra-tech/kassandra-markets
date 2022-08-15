
import { Price } from 'src/price/entities/price.entity';
import { Exchanges } from '../../enums/exchanges.enum';
import { Market } from './market.entity';
import { Markets } from './markets.entity';

/**
 * Record that contains the name of the exchange with associated markets.
 */
export class MarketsRecord {
    /**
     * Exchange hosting the market.
     * @example Binance
     */
    exchanges: Exchanges[];

    /**
     * Combined markets for requested exchanges.
     */
    markets: Market[];

    /**
     * Exchange specific markets.
     */
    exchangeMarkets: Markets[];

    public constructor(markets: Markets) {
        this.exchanges = [];
        this.markets = [];
        this.exchangeMarkets = [];

        this.updateMarkets(markets);
    }

    /**
     * Update the markets data.
     * @param markets Markets data to update.
     */
    public updateMarkets(markets: Markets) {
        try {
            if (markets !== null) {
                this.updateExchange(markets.exchange);

                var exchangeMarkets = this.exchangeMarkets.find(exchangeMarkets => exchangeMarkets.exchange === markets.exchange);

                if (exchangeMarkets !== undefined) {
                    markets.markets.forEach(market => {
                        var foundMarket = exchangeMarkets.markets.find(marketSearch => marketSearch.market === market.market); // Does this.exchangeMarkets contain the market?

                        if (foundMarket !== undefined) {
                            foundMarket = this.getUpdatedMarketPrice(market);
                        } else {
                            exchangeMarkets.markets.push(market);
                        }

                        var foundMarket = this.markets.find(marketSearch => marketSearch.market === market.market);

                        if (foundMarket !== undefined) {
                            foundMarket = this.getUpdatedMarketPrice(market);
                        } else {
                            this.markets.push(market);
                        }
                    });
                } else {
                    this.exchangeMarkets.push(new Markets(markets.exchange, markets.markets));
                    //this.markets = markets.markets;
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    private updateExchange(exchange: Exchanges) {
        if (!this.exchanges.includes(exchange)) {
            this.exchanges.push(exchange);
        }
    }

    private getUpdatedMarketPrice(market: Market): Market {
        var newPrice = new Price(market.market);
        newPrice.updatePriceData(market.price, market.lowPrice, market.highPrice, market.buyVolume, market.sellVolume, market.volume);

        var newMarket = new Market(newPrice)
        newMarket.updatePrice(newPrice);

        return newMarket;
    }
}
