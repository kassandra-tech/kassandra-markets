import { Injectable } from '@nestjs/common';
import { ExchangeMarkets } from './entities/exchange.markets.entity';
import { Exchanges } from './enums/exchanges.enum';
import { MarketsData } from './markets.data';

/**
 * Supported market requests.
 */
@Injectable()
export class MarketsService {
  private marketsData = new MarketsData();

  public async getExchangeMarket(exchanges: Exchanges[]): Promise<ExchangeMarkets[]> {
    return this.marketsData.getExchangeMarket(exchanges);
  }
}
