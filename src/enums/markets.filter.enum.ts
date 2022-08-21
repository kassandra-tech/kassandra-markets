/** 
 * Supported Kassandra market filters.
 * @example All, Favorites, BTC, USD, USDT, ETH, BNB
 */
export enum MarketsFilter {
  /** 
   * All will provide information for all supported markets.
   */
  All = "All",

  /**
   * Favorites
   */
  Favorites = 'Favorites',

  /**
   * BTC
   */
  BTC = 'BTC',

  /**
   * USD
   */
  USD = 'USD',

  /**
   * USDT
   */
  USDT = "USDT",

  /**
   * ETH
   */
  ETH = "ETH",

  /**
   * BNB
   */
  BNB = "BNB"
}
