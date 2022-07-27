import { Injectable } from '@nestjs/common';
import { Data } from 'src/data/Data';
import { Exchanges } from 'src/enums/exchanges.enum';
import { MarketPrices } from './entities/market.prices.entity';
import { PriceData } from './price.data';

/**
 * Supported market requests.
 */
@Injectable()
export class PriceService extends Data {
  private marketsData = new PriceData();
  private price = new PriceData();

  public constructor() {
    super();
  }

  /**
   * Get supported markets for the requested exchange(s),
   * @param exchanges Exchange(s) to return markets of.
   * @returns Exchange markets for the requested exchange(s).
   */
  public async getCurrentMarketPrices(exchanges: Exchanges[]): Promise<MarketPrices[]> {
    var exchangePrices: MarketPrices[] = [];
    var exchangeList: Exchanges[] = this.getExchanges(exchanges);

    try {
      // Check to see if the database already has an ExchangeMarket for the requested market(s).
      for (const exchange of exchangeList) {
        var prices: MarketPrices;

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
}
