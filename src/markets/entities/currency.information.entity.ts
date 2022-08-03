/**
 * Additional details about a curreny.
 */
export class CurrencyInformation {
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

    constructor(symbol: string, name: string, rank: number, rating: string) {
        this.symbol = symbol;
        this.name = name;
        this.rank = rank;
        this.rating = rating;
    }
}
