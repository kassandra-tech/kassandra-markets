import { Injectable } from '@nestjs/common';
import { ExchangeMarkets } from './entities/exchange.markets.entity';
import { Exchanges } from '../enums/exchanges.enum';
import { ExchangeMarket } from './entities/exchange.market.entity';
import { Market } from './entities/market.entity';
import { CurrentPrice } from 'src/price/entities/current.price.entity';
import { Prices } from 'src/price/entities/prices.entity';
import { CurrencyData } from 'src/currency/currency.data';
import { MoralisHelpers } from 'src/data/MoralisHelpers';

/**
 * Interact with the Kassandra datastore to retrieve and store market data.
 */
@Injectable()
export class MarketsData extends MoralisHelpers {
  public currencyData: CurrencyData;

  constructor() {
    super();

    this.currencyData = new CurrencyData();
  }

  /**
   * Get ExchangeMarkets record in the Kassandra datastore for the requested exchange.
   * @param exchange Exchange to get markets for.
   * @returns ExchangeMarkets record with all supported markets.
   */
  public async getExchangeMarketRecord(exchange: Exchanges): Promise<ExchangeMarkets> {
    return await this.getKassandraData(this.Definitions.ExchangeMarketString, this.Definitions.marketsString, exchange);
  }

  /**
   * Save ExchangeMarkets record in the Kassandra datastore.
   * @param exchange Exchange to save markets for.
   * @param markets ExchangeMarkets record with all supported markets.
   */
  public async saveExchangeMarkets(exchange: Exchanges, markets: ExchangeMarkets) {
    await this.saveKassandraData(this.Definitions.ExchangeMarketString, this.Definitions.marketsString, markets, exchange);
  }

  /**
   * Save a market record.
   * @param exchange Exchange to store the market record for.
   * @param exchangeMarkets Markets for the exchange.
   * @param currentPrices  Current exchange market prices.
   * @param prices Exchange historical prices.
   */
  async saveMarketRecord(exchange: Exchanges, exchangeMarkets: ExchangeMarket[], currentPrices: CurrentPrice[], prices: Prices) {
    try {
      var list: Market[] = [];

      await this.updateCurrencies(exchange, exchangeMarkets);

      prices.prices.forEach(price => {
        var market = list.find(market => market.price.market === price.market);

        if (market !== undefined) {
          var price = prices.prices.find(priceRecord => priceRecord.market === price.market);
          if (price !== undefined) {
            market.updatePrice(price);
          }
        } else {
          var exchangeMarket = exchangeMarkets.find(exchangeMarket => exchangeMarket.market === price.market);
          var currentPrice = currentPrices.find(currentPrice => currentPrice.market === price.market);
          var priceRecord = prices.prices.find(priceRecord => priceRecord.market === price.market);

          if (exchangeMarket !== undefined && currentPrice !== undefined && priceRecord !== undefined) {
            var marketRecord = new Market(exchangeMarket, currentPrice, priceRecord, [exchange]);

            list.push(marketRecord);
          }
        }
      })

      await this.saveKassandraData(this.Definitions.MarketRecordString, this.Definitions.marketsString, list);
    } catch (error) {
      console.log(error);
    }
  }

  private async updateCurrencies(exchange: Exchanges, exchangeMarkets: ExchangeMarket[]) {
    if (!this.currencyData.initialized) {

      await this.currencyData.isInitialize(exchange, exchangeMarkets);
    }
  }
}
