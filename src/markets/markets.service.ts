import { Injectable } from '@nestjs/common';
import { Binance } from 'src/exchanges/binance';
import { Coinbase } from 'src/exchanges/coinbase';
import { Exchanges } from '../enums/exchanges.enum';
import { KassandraData } from 'src/data/KassandraData';
import { MarketsRecord } from './entities/markets.record.entity';
import { MarketsData } from './markets.data';
import { MarketsFilter } from 'src/enums/markets.filter.enum';

/**
 * Supported market requests.
 */
@Injectable()
export class MarketsService extends KassandraData {
  private binance = new Binance();
  private coinbase = new Coinbase();
  private marketData: MarketsData = new MarketsData();

  /**
   * Get market records for the given exchanges.
   * @param exchanges Exchange(s) to return markets of.
   * @returns Markets records for the requested exchange(s).
   */
  public async getMarketRecords(exchanges: Exchanges[], marketsFilter: MarketsFilter): Promise<MarketsRecord[]> {
    return await this.marketData.getMarketRecords(exchanges, marketsFilter);
  }
}
