import { Injectable } from '@nestjs/common';
import { Exchanges } from '../enums/exchanges.enum';
import { ExchangeMarket } from './entities/exchange.market.entity';
import { Market } from './entities/market.entity';
import { CurrentPrice } from 'src/price/entities/current.price.entity';
import { Prices } from 'src/price/entities/prices.entity';
import { KassandraData } from 'src/data/KassandraData';
import { CurrencyData } from 'src/currency/currency.data';
import { MarketsRecord } from './entities/markets.record.entity';
import { Markets } from './entities/markets.entity';

/**
 * Interact with the Kassandra datastore to retrieve and store market data.
 */
@Injectable()
export class MarketsData extends KassandraData {
  private Data: CurrencyData = new CurrencyData();
  /**
   * Get market records for the given exchanges.
   * @param exchanges Exchange(s) to return markets of.
   * @returns Markets records for the requested exchange(s).
   */
   public async getMarketRecords(exchanges: Exchanges[]): Promise<MarketsRecord> {
    var marketsRecord: MarketsRecord;
    var exchangeList: Exchanges[] = [];

    try {
      exchangeList = this.getExchanges(exchanges);

      var records = await this.getKassandraObjects(this.Definitions.MarketsString, 30);

      if (records !== undefined) {
        records.forEach(record => { // Database row
          var exchange = record.get(this.Definitions.exchangeString)
          var markets: Market[] = record.get(this.Definitions.marketsString);

          if (exchangeList.includes(exchange)) {
            if (markets !== undefined) {
              var newMarkets = new Markets(exchange, markets);

              if (marketsRecord !== undefined) {
                marketsRecord.updateMarkets(newMarkets);         
              } else {
                marketsRecord = new MarketsRecord(newMarkets);
              }
            }
          }
        })
      }

      return marketsRecord;
      } catch (error) {
        console.log(error);
      }
    }

  /**
   * Save a market record.
   * @param exchange Exchange to store the market record for.
   * @param exchangeMarkets Markets for the exchange.
   * @param currentPrices  Current exchange market prices.
   * @param prices Exchange historical prices.
   */
  public async saveMarkets(exchange: Exchanges, exchangeMarkets: ExchangeMarket[], currentPrices: CurrentPrice[], prices: Prices) {
    try {
      var markets: Market[] = [];

      await this.Data.saveCurrencies(exchange, exchangeMarkets);

      exchangeMarkets.forEach(market => {
        var symbol = market.market;

        var currentPrice = currentPrices.find(currentPrice => currentPrice.market === symbol);
        var price = prices.prices.find(price => price.market === symbol);
        var currency = this.Data.currencies.find(currency => currency.symbol === market.currency);

        var newMarket = new Market(price, currency, market.quoteCurrency, currentPrice);

        if (newMarket.market !== undefined) {
          markets.push(newMarket);
        }
      })

      await this.saveKassandraData(this.Definitions.MarketsString, this.Definitions.marketsString, markets, exchange);
    } catch (error) {
      console.log(error);
    }
  }
}
