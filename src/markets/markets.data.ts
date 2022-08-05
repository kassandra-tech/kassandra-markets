import { Injectable } from '@nestjs/common';
import { DataDefinitions } from '../data/DataDefinitions';
import { ExchangeMarkets } from './entities/exchange.markets.entity';
import { Exchanges } from '../enums/exchanges.enum';
import { Data } from 'src/data/Data';
import { ExchangeMarket } from './entities/exchange.market.entity';
import { Market } from './entities/market.entity';
import { CurrentPrice } from 'src/price/entities/current.price.entity';
import { Prices } from 'src/price/entities/prices.entity';
import { CurrencyData } from 'src/currency/currency.data';

const Moralis = require("moralis/node");
const Definitions = new DataDefinitions();
const data = new Data();

/**
 * Interact with the Kassandra datastore to retrieve and store market data.
 */
@Injectable()
export class MarketsData {
  public currencyData: CurrencyData;

  constructor() {
    this.currencyData = new CurrencyData();
  }

  /**
   * Get ExchangeMarkets record in the Kassandra datastore for the requested exchange.
   * @param exchange Exchange to get markets for.
   * @returns ExchangeMarkets record with all supported markets.
   */
  public async getExchangeMarketRecord(exchange: Exchanges): Promise<ExchangeMarkets> {
    try {
      var moralisObj = Moralis.Object.extend(Definitions.ExchangeMarketString);
      var query = new Moralis.Query(moralisObj);
      query.greaterThan(Definitions.createdAtString, data.getDaysBefore());
      query.descending(Definitions.createdAtString);
      query.equalTo(Definitions.exchangeString, exchange);

      var record = await query.first();

      if (record != undefined) {
        return record.get(Definitions.marketsString);
      }

      return undefined;
    } catch (error) {
      console.log(error);
    }

  }

  /**
   * Save ExchangeMarkets record in the Kassandra datastore.
   * @param exchange Exchange to save markets for.
   * @param markets ExchangeMarkets record with all supported markets.
   */
  public async saveExchangeMarkets(exchange: Exchanges, markets: ExchangeMarkets) {
    try {
      var moralisObj = Moralis.Object.extend(Definitions.ExchangeMarketString);
      var marketObj = new moralisObj();
      marketObj.set(Definitions.exchangeString, exchange);
      marketObj.set(Definitions.marketsString, markets);

      await marketObj.save();
    } catch (error) {
      console.log(error);
    }
  }



  async saveMarketRecord(exchange: Exchanges, exchangeMarkets: ExchangeMarket[], currentPrices: CurrentPrice[], prices: Prices) {
    try {
      var list: Market[] = [];

      await this.updateCurrencies(exchange, exchangeMarkets);

      prices.prices.forEach(price => {
        var market = list.find(market => market.market === price.market);

        if (market !== undefined) {
          var price = prices.prices.find(priceRecord => priceRecord.market === price.market);
          market.update(price);
        } else {
          var exchangeMarket = exchangeMarkets.find(exchangeMarket => exchangeMarket.market === price.market);
          var currentPrice = currentPrices.find(currentPrice => currentPrice.market === price.market);
          var priceRecord = prices.prices.find(priceRecord => priceRecord.market === price.market);

          if (exchangeMarket !== undefined && currentPrice !== undefined && priceRecord !== undefined) {
            var marketRecord = new Market(exchangeMarket, currentPrice, priceRecord, [exchange]);

            list.push(marketRecord);
          }
        }
      });

      var MarketObj = Moralis.Object.extend(Definitions.marketRecordString);
      var marketObj = new MarketObj();
      marketObj.set(Definitions.marketsString, list);

      await marketObj.save();
    } catch (error) {
      console.log(error);
    }
  }

  private async updateCurrencies(exchange: Exchanges, exchangeMarkets: ExchangeMarket[]) {
    if (!this.currencyData.initialized) {

        await this.currencyData.initialize(exchange, exchangeMarkets);
    }
}
}
