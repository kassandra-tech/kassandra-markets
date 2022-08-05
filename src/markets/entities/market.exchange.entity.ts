import { Exchanges } from '../../enums/exchanges.enum';
import { Currency } from '../../currency/entity/currency.entity';
import { ExchangeMarket } from './exchange.market.entity';

export class MarketExchange {
    /**
     * Markets supported by the exchange.
     * @example BTC-USD
     */
    market: string;

    /**
     * Currency being sold in the market.
     * @example BTC
     */
    currency: string;

    /**
     * Currency being purchased in the market.
     * @example USD
     */
    quoteCurrency: string;

    /**
     * Name of the currency.
     * @example Bitcoin
     */
    currencyName: string;

    /**
     * Net worth among traded cryptocurrencies and tokens.
     * Higher is better.
     * @example 1
     */
    rank: number

    /**
     * Measure of relative security around investing in and trading a crypto asset.
     * @example A-
     */
    rating: string;

    /**
     * Exchange(s) hosting the market.
     * @example Binance, Coinbase
     */
         exchanges: Exchanges[] = [];

    public constructor(exchange: Exchanges, exchangeMarket: ExchangeMarket, currencyInformation: Currency) {
        this.update(exchange);
        this.market = exchangeMarket.market;
        this.currency = exchangeMarket.currency;
        this.quoteCurrency = exchangeMarket.quoteCurrency;
        this.currencyName = currencyInformation.name;
        this.rank = currencyInformation.rank;
        this.rating = currencyInformation.rating;
    }

    public update(exchange: Exchanges) {
        if (!this.exchanges.includes(exchange)) {
            this.exchanges.push(exchange);
        }
    }
}
