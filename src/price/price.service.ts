import { Injectable } from '@nestjs/common';
import { Base } from 'src/data/Base';
import { Exchanges } from 'src/enums/exchanges.enum';
import { CurrentPrices } from './entities/current.prices.entity';
import { Prices } from './entities/prices.entity';
import { PriceData } from './price.data';

/**
 * Supported market requests.
 */
@Injectable()
export class PriceService extends Base {
  private price = new PriceData();

  public constructor() {
    super();
  }

  /**
   * Get supported markets for the requested exchange(s),
   * @param exchanges Exchange(s) to return markets of.
   * @returns Exchange markets for the requested exchange(s).
   */
  public async getCurrentMarketPrices(exchanges: Exchanges[]): Promise<CurrentPrices[]> {
    var exchangePrices: CurrentPrices[] = [];
    var exchangeList: Exchanges[] = this.getExchanges(exchanges);

    try {
      // Check to see if the database already has an ExchangeMarket for the requested market(s).
      for (const exchange of exchangeList) {
        var prices: CurrentPrices;

        if (exchange === Exchanges.Binance) {
          prices = await this.price.getCurrentPriceRecord(exchange);
          exchangePrices.push(prices);
        } else if (exchange === Exchanges.Coinbase) {
          prices = await this.price.getCurrentPriceRecord(exchange);
          exchangePrices.push(prices);
        }
      }

      return exchangePrices;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Get supported markets for the requested exchange(s),
   * @param exchanges Exchange(s) to return markets of.
   * @returns Exchange markets for the requested exchange(s).
   */
     public async getMarketPrices(exchanges: Exchanges[]): Promise<Prices[]> {
      var exchangePrices: Prices[] = [];
      var exchangeList: Exchanges[] = this.getExchanges(exchanges);
  
      try {
        // Check to see if the database already has an ExchangeMarket for the requested market(s).
        for (const exchange of exchangeList) {
          var prices: Prices;
  
          if (exchange === Exchanges.Binance) {
            prices = await this.price.getPriceRecord(exchange);
            exchangePrices.push(prices);
          } else if (exchange === Exchanges.Coinbase) {
            prices = await this.price.getPriceRecord(exchange);
            exchangePrices.push(prices);
          }
        }
  
        return exchangePrices;
      } catch (error) {
        console.log(error);
      }
    }
}
