import { Injectable } from '@nestjs/common';
import { KassandraData } from 'src/data/KassandraData';
import { Exchanges } from 'src/enums/exchanges.enum';
import { ExchangeMarket } from 'src/markets/entities/exchange.market.entity';
import { Market } from 'src/markets/entities/market.entity';
import { Currency } from './entity/currency.entity';

var currencyInfo: Currency[] = [];
var symbols: string[] = [];

/**
 * Interact with the Kassandra datastore to retrieve and store currency data.
 */
@Injectable()
export class CurrencyData extends KassandraData {
    public currencies: Currency[] = [];
    private markets: Market[] = [];
    private exchangeMarkets: ExchangeMarket[] = [];

    /**
     * Initialize the currency for the requested exchange.
     * @param exchange Exchange to initialize.
     * @param markets Markets for the requested exchange.
     * @returns True, when all information needed to use currencies has been found.
     */
    public async initialize(exchange: Exchanges, markets: ExchangeMarket[]) {
        try {
            currencyInfo = await this.getCurrencyInformation();

            if (currencyInfo === undefined) {
                currencyInfo = [];
            }

            var response = await this.getCurrencies([exchange]);

            if (response !== undefined && response.length > 0) {
                this.currencies = response;
            }

            if (markets !== undefined) {
                markets.forEach(market => {
                    if (!symbols.includes(market.currency)) {
                        symbols.push(market.currency);
                    }

                    if (!symbols.includes(market.quoteCurrency)) {
                        symbols.push(market.quoteCurrency);
                    }
                })
            }
        } catch (error) {
            console.log(error);
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
     * @param markets Markets to update currencies from.
     */
    public async saveCurrencies(exchange: Exchanges, markets: ExchangeMarket[]) {
        try {
            var isUpdated: boolean;

            var updatedMarkets = this.updateExchangeMarkets(this.exchangeMarkets, markets);

            if (this.exchangeMarkets != updatedMarkets) {
                this.exchangeMarkets = updatedMarkets;
                this.initialize(exchange, this.exchangeMarkets);
            }

            if (currencyInfo.length > 0) {
                symbols.forEach(symbol => {
                    var currency: Currency = this.currencies.find(currency => currency.symbol === symbol);

                    if (currency !== undefined) {
                        if (!currency.exchanges.includes(exchange)) {
                            currency.exchanges.push(exchange);
                            isUpdated = true;
                        }

                        this.currencies.push(currency);
                    } else {
                        currency = new Currency(symbol, exchange);

                        var info = currencyInfo.find(info => info.symbol === symbol);

                        if (info !== undefined) {
                            currency.updateInfo(info.name, info.rank, info.rating);
                        }

                        this.currencies.push(currency);
                    }
                })

                if (this.currencies.length > 0 && isUpdated) {
                    await this.saveKassandraData(this.Definitions.CurrenciesString, this.Definitions.currenciesString, this.currencies);
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
