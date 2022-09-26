import { IsString } from 'class-validator';

/**
 * Binance market data.
 */
export class BinanceMarket {
  /**
   * Base currency in the market.
   */
  @IsString()
  readonly baseAsset: string;

  /**
   * Quote currency in the market.
   */
  @IsString()
  readonly quoteAsset: string;

  /**
   * Exchange market value.
   */
  @IsString()
  readonly symbol: string;
}
