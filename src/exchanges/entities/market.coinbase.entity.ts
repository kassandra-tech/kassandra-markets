import { IsString } from 'class-validator';

/**
 * Coinbase market data.
 */
export class CoinbaseMarket {
  /**
   * Base currency in the market.
   */
  @IsString()
  readonly base_currency: string;

  /**
   * Quote currency in the market.
   */
  @IsString()
  readonly quote_currency: string;

  /**
   * Exchange market value.
   */
  @IsString()
  readonly display_name: string;
}
