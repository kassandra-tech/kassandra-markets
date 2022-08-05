/**
 * Common market format so all exchanges can be easily accessed by Kassandra.
 */
export class ExchangeMarket {
  /**
   * Kassandra market format.
   * @example BTC-USD
   */
  market: string;

  /**
   * Exchange market format.
   * @example BTC/USD
   */
  format: string;

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

  constructor(format: string, currency: string, quoteCurrency: string) {
    this.market = currency + '-' + quoteCurrency;
    this.format = format;
    this.currency = currency;
    this.quoteCurrency = quoteCurrency;
  }
}
