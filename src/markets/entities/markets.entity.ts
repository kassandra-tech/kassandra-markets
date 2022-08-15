
import { Exchanges } from '../../enums/exchanges.enum';
import { Market } from './market.entity';

/**
 * Record that contains the name of the exchange with associated markets.
 */
 export class Markets {
    /**
     * Exchange hosting the market.
     * @example Binance
     */
    exchange: Exchanges;

    /**
     * Market records.
     */
    markets: Market[];

    public constructor(exchange: Exchanges, markets: Market[]) {
        this.exchange = exchange;
        this.markets = markets;
    }
}
