import { Injectable } from '@nestjs/common';
import { MoralisHelpers } from 'src/data/MoralisHelpers';
import { Exchanges } from 'src/enums/exchanges.enum';
import { ExchangeMarket } from 'src/markets/entities/exchange.market.entity';
import { Currency } from './entity/currency.entity';

var currencyInfo: Currency[] = [];
var currencies: Currency[] = [];
var symbols: string[] = [];

/**
 * Interact with the Kassandra datastore to retrieve and store currency data.
 */
@Injectable()
export class CurrencyData extends MoralisHelpers {
    public initialized: boolean = false;

    /**
     * Initialize the currency for the requested exchange.
     * @param exchange Exchange to initialize.
     * @param markets Markets for the requested exchange.
     * @returns True, when all information needed to use currencies has been found.
     */
    public async initialize(exchange: Exchanges, markets: ExchangeMarket[]) {
        try {
            currencyInfo = await this.getCurrencyInformation();

            var response = await this.getCurrencies([exchange]);

            if (response !== undefined && response.length > 0) {
                currencies = response;
            }

            markets.forEach(market => {
                if (!symbols.includes(market.currency)) {
                    symbols.push(market.currency);
                }

                if (!symbols.includes(market.quoteCurrency)) {
                    symbols.push(market.quoteCurrency);
                }
            })
        } catch (error) {
            console.log(error);
        } finally {
            return this.initialized = currencyInfo.length > 0 && currencies.length > 0 && symbols.length > 0;
        }

    }

    /**
     * Get details about currencies (name, rank, rating).
     * @returns Currency Information for all provided currencies.
     */
    public async getCurrencyInformation(): Promise<Currency[]> {
        return await this.getKassandraData(this.Definitions.CurrencyInformationString, this.Definitions.currenciesString);
    }

    /**
     * Save currencies to the datastore if there is an update to the currencies.
     * @param exchange Exchange to save currencies for.
     */
    public async saveCurrencies(exchange: Exchanges) {
        try {
            var isUpdated: boolean;

            if (currencyInfo.length > 0) {
                symbols.forEach(symbol => {
                    var currency: Currency = currencies.find(currency => currency.name === symbol);

                    if (currency !== undefined) {
                        if (!currency.exchanges.includes(exchange)) {
                            currency.exchanges.push(exchange);
                            isUpdated = true;
                        }

                        currencies.push(currency);
                    } else {
                        currency = new Currency(symbol, exchange);

                        var info = currencyInfo.find(info => info.symbol === symbol);

                        if (info !== undefined) {
                            currency.updateInfo(info.name, info.rank, info.rating);
                        }

                        currencies.push(currency);
                    }
                })

                if (currencies.length > 0 && isUpdated) {
                    await this.saveKassandraData(this.Definitions.CurrenciesString, this.Definitions.currenciesString, currencies);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Get currencies for the requested exchange(s).
     * @param exchanges Exchanges to get currencies for.
     * @returns Currencies for the requested exchange(s).
     */
    public async getCurrencies(exchanges: Exchanges[]): Promise<Currency[]> {
        try {
            exchanges = this.getExchanges(exchanges);

            var currencies: Currency[] = await this.getKassandraData(this.Definitions.CurrenciesString, this.Definitions.currenciesString);

            if (currencies !== undefined) {
                currencies.forEach(currency => {
                    exchanges.forEach(exchange => {
                        if (currency.exchanges.includes(exchange) && !currencies.includes(currency)) {
                            currencies.push(currency);
                        }
                    })

                })
            }
        } catch (error) {
            console.log(error);
        } finally {
            return currencies;
        }
    }
}
