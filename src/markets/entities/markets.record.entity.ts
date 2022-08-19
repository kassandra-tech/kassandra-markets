
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
    market: Market;

    /**
     * Exchange specific markets.
     */
    exchangeMarkets: Markets[];

    public constructor(exchange: Exchanges, market: Market) {
        this.exchanges = [];
        this.exchangeMarkets = [];

        this.updateMarkets(exchange, market);
    }

    /**
     * Update the markets data.
     * @param market Markets data to update.
     */
    public updateMarkets(exchange: Exchanges, market: Market) {
        try {
            if (market !== null && market !== undefined) {
                this.updateExchange(exchange);

                var exchangeMarket = this.exchangeMarkets.find(exchangeMarkets => exchangeMarkets.exchange === exchange);
                var price = new Price(market.market).updatePriceData(market.price, market.lowPrice, market.highPrice, market.buyVolume, market.sellVolume);

                if (exchangeMarket !== undefined) {
                    var foundMarket = exchangeMarket.markets.find(marketSearch => marketSearch.market === market.market); // Does this.exchangeMarkets contain the market?

                    if (foundMarket !== undefined) {
                        foundMarket = new Market(price);
                        foundMarket.updatePrice(market.price, market.lowPrice, market.highPrice, market.buyVolume, market.sellVolume);
                    } else {
                        exchangeMarket.markets.push(market);
                    }
                } else {
                    this.exchangeMarkets.push(new Markets(exchange, [market]));
                }

                if (this.market !== undefined) {
                    this.market.updatePrice(market.price, market.lowPrice, market.highPrice, market.buyVolume, market.sellVolume);
                } else {
                    this.market = new Market(price);
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
}
