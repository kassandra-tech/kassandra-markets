import { Injectable } from '@nestjs/common';
import { DataDefinitions } from '../data/DataDefinitions';
import { ExchangeMarkets } from './entities/exchange.markets.entity';
import { Exchanges } from '../enums/exchanges.enum';

const Moralis = require("moralis/node");
const Definitions = new DataDefinitions();

/**
 * Interact with the Kassandra datastore to retrieve and store market data.
 */
@Injectable()
export class MarketsData {
  /**
   * Get ExchangeMarkets record in the Kassandra datastore for the requested exchange.
   * @param exchange Exchange to get markets for.
   * @returns ExchangeMarkets record with all supported markets.
   */
  public async getExchangeMarketsRecord(exchange: Exchanges): Promise<ExchangeMarkets> {
    try {
      var moralisObj = Moralis.Object.extend(Definitions.ExchangeMarketString);
      var query = new Moralis.Query(moralisObj);
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
}
