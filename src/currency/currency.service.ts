import { Injectable } from '@nestjs/common';
import { Base } from 'src/data/Base';
import { Exchanges } from 'src/enums/exchanges.enum';
import { CurrencyData } from './currency.data';
import { Currency } from './entity/currency.entity';

var currencyData: CurrencyData = new CurrencyData();

/**
 * Supported market requests.
 */
@Injectable()
export class CurrencyService extends Base {
  public constructor() {
    super();
  }

  /**
   * Get currencies for the requested exchange(s),
   * @param exchanges Exchange(s) to return markets of.
   * @returns Currencies for the requested exchange(s).
   */
  public async getCurrencies(exchanges: Exchanges[]): Promise<Currency[]> {
    var exchanges: Exchanges[] = this.getExchanges(exchanges);

    try {
      return await currencyData.getCurrencies(exchanges);
    } catch (error) {
      console.log(error);
    }
  }
}
