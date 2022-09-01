import { Injectable } from '@nestjs/common';
import { Base } from 'src/data/Base';
import { Exchanges } from 'src/enums/exchanges.enum';
import { MarketsService } from 'src/markets/markets.service';
import { CurrencyData } from './currency.data';
import { Currency } from './entity/currency.entity';

/**
 * Supported market requests.
 */
@Injectable()
export class CurrencyService extends Base {

  /**
   * Get currencies for the requested exchange(s),
   * @param exchanges Exchange(s) to return markets of.
   * @returns Currencies for the requested exchange(s).
   */
  public getCurrencies(exchanges: Exchanges[]): Currency[] {
    try {
      var currencies: Currency[] = [];
      exchanges = this.getExchanges(exchanges);

      exchanges.forEach(exchange => {
        switch (exchange) {
          case Exchanges.Binance: {
            var exchangeCurrencies = MarketsService.binance.getCurrencies();
            currencies = currencies.concat(exchangeCurrencies);
            break;
          }
          case Exchanges.Coinbase: {
            var exchangeCurrencies = MarketsService.coinbase.getCurrencies();
            currencies = currencies.concat(exchangeCurrencies);
            break;
          }
        }
      })

      const uniqueSymbols = [];

      const unique = currencies.filter(currency => {
        const isDupe = uniqueSymbols.includes(currency.symbol);

        if (!isDupe) {
          uniqueSymbols.push(currency.symbol);

          return true;
        }

        return false;
      })

      return unique;
    } catch (error) {
      console.log(error);
    }
  }
}
