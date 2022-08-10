import { Injectable } from '@nestjs/common';
import { Binance } from 'src/exchanges/binance';
import { Coinbase } from 'src/exchanges/coinbase';
import { ExchangeMarkets } from './entities/exchange.markets.entity';
import { Exchanges } from '../enums/exchanges.enum';
import { Market } from './entities/market.entity';
import { KassandraData } from 'src/data/KassandraData';

/**
 * Supported market requests.
 */
@Injectable()
export class MarketsService extends KassandraData {
  private binance = new Binance();
  private coinbase = new Coinbase();

  /**
   * Get supported markets for the requested exchange(s),
   * @param exchanges Exchange(s) to return markets of.
   * @returns Exchange markets for the requested exchange(s).
   */
  public async getExchangeMarkets(exchanges: Exchanges[]): Promise<ExchangeMarkets[]> {

    var exchangeMarkets: ExchangeMarkets[] = [];
    var exchangeList: Exchanges[] = [];

    try {
      exchangeList = this.getExchanges(exchanges);

      // Check to see if the database already has an ExchangeMarket for the requested market(s).
      for (const exchange of exchangeList) {

        var markets: ExchangeMarkets;

        if (exchange === Exchanges.Binance) {
          markets = await this.binance.getMarkets();

          exchangeMarkets.push(markets);
        } else if (exchange === Exchanges.Coinbase) {
          markets = await this.coinbase.getMarkets();

          exchangeMarkets.push(markets);
        }
      }

      return exchangeMarkets;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Get market records for the given exchanges.
   * @param exchanges Exchange(s) to return markets of.
   * @returns Markets records for the requested exchange(s).
   */
  public async getMarketRecords(exchanges: Exchanges[]): Promise<Market[]> {
    var exchangeList: Exchanges[] = [];

    try {
      exchangeList = this.getExchanges(exchanges);
      var marketRecords: Market[] = [];

      var records: Market[] = await this.getKassandraObjects(this.Definitions.MarketRecordString, 5);
      
      if (records !== undefined) {
        records.forEach(record => {
          exchangeList.forEach(exchange => {
            if (exchangeList.includes(exchange) && !marketRecords.includes(record)) {
              marketRecords.push(record);
            }
          })
        })
      }

      return marketRecords;
    } catch (error) {
      console.log(error);
    }
  }
}
