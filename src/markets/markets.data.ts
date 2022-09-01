import { Injectable } from '@nestjs/common';
import { Exchanges } from '../enums/exchanges.enum';
import { ExchangeMarket } from './entities/exchange.market.entity';
import { Market } from './entities/market.entity';
import { Prices } from 'src/price/entities/prices.entity';
import { CurrencyData } from 'src/currency/currency.data';
import { MarketsRecord } from './entities/markets.record.entity';
import { MarketsFilter } from 'src/enums/markets.filter.enum';

/**
 * Interact with the Kassandra datastore to retrieve and store market data.
 */
@Injectable()
export class MarketsData extends CurrencyData {
  /**
   * Get market records for the given exchanges.
   * @param exchanges Exchange(s) to return markets of.
   * @returns Markets records for the requested exchange(s).
   */
  public async getMarketRecords(exchanges: Exchanges[], marketFilters: MarketsFilter = MarketsFilter.All): Promise<MarketsRecord[]> {
    var marketsRecord: MarketsRecord[] = [];
    var exchangeList: Exchanges[] = [];

    try {
      exchangeList = this.getExchanges(exchanges);

      var records = await this.getKassandraObjects(this.Definitions.MarketsString, 30);

      if (records !== undefined) {
        for (const record of records) { // Database row
          var exchange = record.get(this.Definitions.exchangeString)
          var markets: Market[] = record.get(this.Definitions.marketsString);

          if (exchangeList.includes(exchange)) {
            if (markets !== undefined) {
              if (this.Currencies.length === 0) {
                await this.updateCurrencies(markets.map(market => market.market));
              }

              markets.forEach(async market => {
                if (marketFilters === MarketsFilter.All || this.getCurrencyFromMarket(market.market, false) === marketFilters) {
                  var record = marketsRecord.find(record => record.market.market === market.market);

                  if (record !== undefined) {
                    var currency = this.Currencies.find(currency => currency.symbol === this.getCurrencyFromMarket(market.market));

                    record.updateMarkets(exchange, market, currency);
                  } else {
                    marketsRecord.push(new MarketsRecord(exchange, market, currency));
                  }
                }
              })
            }
          }
        }
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
  public async saveMarkets(exchange: Exchanges, exchangeMarkets: ExchangeMarket[], prices: Prices) {
    try {
      var markets: Market[] = [];

      exchangeMarkets.forEach(market => {
        var symbol = market.market;

        var price = prices.prices.find(price => price.market === symbol);

        var newMarket = new Market(price);

        if (price !== undefined) {
          markets.push(newMarket);
        }
      })

      if (markets.length > 0) {
        await this.saveKassandraData(this.Definitions.MarketsString, this.Definitions.marketsString, markets, exchange);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
