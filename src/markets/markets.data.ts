import { Injectable } from '@nestjs/common';
import { Binance } from '../exchanges/binance';
import { Coinbase } from '../exchanges/coinbase';
import { DataDefinitions } from '../data/DataDefinitions';
import { ExchangeMarkets } from './entities/exchange.markets.entity';
import { Exchanges } from './enums/exchanges.enum';

const Moralis = require("moralis/node");
const Definitions = new DataDefinitions();

/**
 * Interact with the Kassandra datastore to retrieve and store market data.
 */
@Injectable()
export class MarketsData {
  private binance = new Binance();
  private coinbase = new Coinbase();

  /**
   * Get supported markets for the requested exchange(s),
   * @param exchanges Exchange(s) to return markets of.
   * @returns Exchange markets for the requested exchange(s).
   */
  public async getExchangeMarket(exchanges: Exchanges[]): Promise<ExchangeMarkets[]> {

    var list: ExchangeMarkets[] = [];
    var exchangeList: Exchanges[] = [];

    try {
      if (exchanges.includes(Exchanges.All)) {
        exchangeList = this.getAllExchanges();
      } else if (Array.isArray(exchanges)) {
        Array.from(exchanges).forEach(exchange => {
          exchangeList.push(exchange);
        })
      } else {
        exchangeList.push(exchanges);
      }

      var moralisObj = Moralis.Object.extend(Definitions.ExchangeMarketString);
      var query = new Moralis.Query(moralisObj);
      query.descending(Definitions.createdAtString);

      // Check to see if the database already has an ExchangeMarket for the requested market(s).
      for (const exchange of exchangeList) {
        query.equalTo(Definitions.exchangeString, exchange);

        var record = await query.first();

        if (record != undefined) {
          var markets = record.get(Definitions.marketsString);
          list.push(markets);
        } else { // If 'ExchangeMarkets' are not found the will be saved to the database.
          if (exchange === Exchanges.Binance) {
            markets = await this.binance.getMarkets();
            list.push(markets);
            this.saveExchangeMarkets(exchange, markets);
          } else if (exchange === Exchanges.Coinbase) {
            markets = await this.coinbase.getMarkets();
            list.push(markets);
            this.saveExchangeMarkets(exchange, markets);
          }
        }
      }

      return list;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Save ExchangeMarkets record in the Kassandra datastore.
   * @param exchange Exchange to save markets for.
   * @param markets ExchangeMarkets record with all supported exchanges.
   */
  private async saveExchangeMarkets(exchange: Exchanges, markets: ExchangeMarkets) {
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

  /**
   * 
   * @returns Create array of all supported exchanges in the Exchanges enum.
   */
  private getAllExchanges(): Exchanges[] {
    var exchanges: Exchanges[] = [];

    exchanges.push(Exchanges.Binance, Exchanges.Coinbase);

    return exchanges;
  }
}
