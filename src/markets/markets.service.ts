import { Injectable } from '@nestjs/common';
import { Binance } from 'src/exchanges/binance';
import { Coinbase } from 'src/exchanges/coinbase';
import { ExchangeMarkets } from './entities/exchange.markets.entity';
import { Exchanges } from './enums/exchanges.enum';
import { MarketsData } from './markets.data';

/**
 * Supported market requests.
 */
@Injectable()
export class MarketsService {
  private marketsData = new MarketsData();

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
      if (exchanges.includes(Exchanges.All)) {
        exchangeList = this.marketsData.getAllExchanges();
      } else if (Array.isArray(exchanges)) {
        Array.from(exchanges).forEach(exchange => {
          exchangeList.push(exchange);
        })
      } else {
        exchangeList.push(exchanges);
      }

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
}
