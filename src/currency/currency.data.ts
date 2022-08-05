import { Injectable } from '@nestjs/common';
import { Data } from 'src/data/Data';
import { Exchanges } from 'src/enums/exchanges.enum';
import { ExchangeMarket } from 'src/markets/entities/exchange.market.entity';
import { DataDefinitions } from '../data/DataDefinitions';
import { Currency } from './entity/currency.entity';

const Moralis = require("moralis/node");
const Definitions = new DataDefinitions();

const data: Data = new Data();
var currencyInfo: Currency[] = [];
var currencies: Currency[] = [];
var symbols: string[] = [];

/**
 * Interact with the Kassandra datastore to retrieve and store market data.
 */
@Injectable()
export class CurrencyData {
    public initialized: boolean;

    public async initialize(exchange: Exchanges, markets: ExchangeMarket[]) {
        try {
            await this.getCurrencyInformation();

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

            return this.initialized = currencyInfo.length > 0 && currencies.length > 0 && symbols.length > 0;
        } catch (error) {
            console.log(error);
        }
    }

    public async getCurrencyInformation(): Promise<Currency[]> {
        try {
            var moralisObj = Moralis.Object.extend(Definitions.CurrencyInformationString);
            var query = new Moralis.Query(moralisObj);
            query.descending(Definitions.createdAtString);

            var record = await query.first();

            if (record !== undefined) {
                currencyInfo = record.get(Definitions.currenciesString);
            }
        } catch (error) {
            console.log(error);
        } finally {
            return currencyInfo = currencyInfo;
        }
    }

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
                    await this.writeCurrencies(currencies);
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            return currencies;
        }
    }

    public async writeCurrencies(currencies: Currency[]) {
        try {
            const Currency = Moralis.Object.extend(Definitions.CurrenciesString);
            const currency = new Currency();

            currency.set(Definitions.currenciesString, currencies);

            await currency.save();
        } catch (error) {
            console.log(error);
        } finally {
            return currencies;
        }
    }

    public async getCurrencies(exchanges: Exchanges[]): Promise<Currency[]> {
        try {
            exchanges = data.getExchanges(exchanges);
            const Currencies = Moralis.Object.extend(Definitions.CurrenciesString);
            const query = new Moralis.Query(Currencies);
            query.descending(Definitions.updatedAtString);

            var record = await query.first();

            if (record !== undefined) {
                var currencies: Currency[] = record.get(Definitions.currenciesString);

                if (currencies !== undefined) {
                    currencies.forEach(currency => {
                        exchanges.forEach(exchange => {
                            if (currency.exchanges.includes(exchange) && !currencies.includes(currency)) {
                                currencies.push(currency);
                            }
                        })

                    })
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            return currencies;
        }
    }
}
