import { Injectable } from '@nestjs/common';
import { Base } from 'src/data/Base';
import { Exchanges } from 'src/enums/exchanges.enum';
import { MarketsService } from 'src/markets/markets.service';
import { Currencies, Currency } from './entity/currency.entity';

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
  public getCurrencies(exchanges: Exchanges[]): Currencies[] {
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

      const uniqueSymbols: Currencies[] = [];
      

      const unique = currencies.filter(currency => {
        const isDupe = uniqueSymbols[currency.symbol];

        if (isDupe === undefined) {
          uniqueSymbols.push({ [currency.symbol]: {name: currency.name, rank: currency.rank, rating: currency.rating }});

          return true;
        }

        return false;
      })

      return uniqueSymbols;
    } catch (error) {
      console.log(error);
    }
  }
}
