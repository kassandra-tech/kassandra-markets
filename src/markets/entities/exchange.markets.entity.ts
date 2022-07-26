import { Exchanges } from '../enums/exchanges.enum';
import { ExchangeMarket } from './exchange.market.entity';

/**
 * Record that contains the name of the exchange with associated exchange markets.
 */
export class ExchangeMarkets {
      /**
     * Exchange hosting the market.
     * @example Binance
     */
    exchange: Exchanges;

    /**
     * Markets supported by the exchange.
     */
    markets: ExchangeMarket[];

    public constructor(exchange: Exchanges, markets: ExchangeMarket[]) {
        this.exchange = exchange;
        this.markets = markets;
    }
}
