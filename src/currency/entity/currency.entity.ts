import { Base } from "src/data/Base";
import { Exchanges } from "src/enums/exchanges.enum";

/**
 * Additional details about a curreny.
 */
export class Currency extends Base {
    /**
     * Currency symbol.
     * @example BTC
     */
    symbol: string;

    /**
     * Name of the currency.
     * @example Bitcoin
     */
    name: string;

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
     * Exchanges the currency is supported on.
     */
    exchanges: Exchanges[];

    constructor(symbol: string, exchange: Exchanges) {
        super();

        this.symbol = symbol;
        this.name = "";
        this.rank = 0;
        this.rating = ""
        this.exchanges = [];

        this.updateExchange(exchange);
    }

    public updateExchange(exchange: Exchanges) {
        if (!this.exchanges.includes(exchange)) {
            this.exchanges.push(exchange);
        }
    }

    public updateInfo(name: string, rank: number, rating: string) {
        this.name = name;
        this.rank = rank;
        this.rating = rating;
    }

    public includesExchanges(exchanges: Exchanges[]): boolean {
        exchanges = this.getExchanges(exchanges);

        exchanges.forEach(exchange => {
            if (this.exchanges.includes(exchange)) {
                return true;
            }
        })

        return false;
    }
}
