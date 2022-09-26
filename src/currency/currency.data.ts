import { Injectable } from '@nestjs/common';
import { KassandraData } from 'src/data/KassandraData';
import { Currency } from './entity/currency.entity';

var Symbols: string[] = [];

/**
 * Interact with the Kassandra datastore to retrieve and store currency data.
 */
@Injectable()
export class CurrencyData extends KassandraData {
    public Currencies: Currency[] = [];
    public Symbols: string[] = [];

    /**
     * Save currencies to the datastore if there is an update to the currencies.
     * @param markets Markets to update currencies from.
     */
    public async updateCurrencies(markets: string[]) {
        try {

            if (markets !== undefined) {
                markets.forEach(market => {
                    if (!Symbols.includes(this.getCurrencyFromMarket(market))) {
                        Symbols.push(this.getCurrencyFromMarket(market));
                    }

                    if (!Symbols.includes(this.getCurrencyFromMarket(market, false))) {
                        Symbols.push(this.getCurrencyFromMarket(market, false));
                    }
                })
            }

            if (this.Currencies.length === 0) {
                var currencies = await this.getKassandraData(this.Definitions.CurrencyInformationString, this.Definitions.currenciesString);

                this.Currencies = currencies.filter(currency => Symbols.includes(currency.symbol));
            }
            
        } catch (error) {
            console.log(error);
        }
    }
}
