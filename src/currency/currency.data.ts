import { Injectable } from '@nestjs/common';
import { KassandraData } from 'src/data/KassandraData';
import { Exchanges } from 'src/enums/exchanges.enum';
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
    private exchangeMarkets: Market[] = [];

    /**
     * Save currencies to the datastore if there is an update to the currencies.
     * @param exchange Exchange to save currencies for.
     * @param markets Markets to update currencies from.
     */
    public async updateCurrencies(exchange: Exchanges, markets: Market[]) {
        try {
            var isUpdated: boolean = false;

            var updatedMarkets = this.updateExchangeMarkets(this.exchangeMarkets, markets);

            if (this.exchangeMarkets != updatedMarkets || currencyInfo.length === 0) {
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

    /**
     * Get the currency information by the currency symbol.
     * @param symbol Currency symbol.
     * @returns Currency information about the requested symbol.
     */
    public async getCurrency(symbol: string): Promise<Currency> {
        var currency: Currency = undefined;

        if (currencyInfo.length > 0) {
            currency = currencyInfo.find(currency => currency.symbol === symbol);
        }

        return currency;
    }

    /**
     * Initialize the currency for the requested exchange.
     * @param exchange Exchange to initialize.
     * @param markets Markets for the requested exchange.
     * @returns True, when all information needed to use currencies has been found.
     */
    public async initialize(exchange: Exchanges, markets: Market[]) {
        try {
            currencyInfo = await this.getKassandraData(this.Definitions.CurrencyInformationString, this.Definitions.currenciesString);

            var response = await this.getCurrencies([exchange]);

            if (response !== undefined && response.length > 0) {
                this.currencies = response;
            }

            if (markets !== undefined) {
                markets.forEach(market => {
                    if (!symbols.includes(this.getCurrencyFromMarket(market.market))) {
                        symbols.push(this.getCurrencyFromMarket(market.market));
                    }

                    if (!symbols.includes(this.getCurrencyFromMarket(market.market, false))) {
                        symbols.push(this.getCurrencyFromMarket(market.market, false));
                    }
                })
            }
        } catch (error) {
            console.log(error);
        }
    }
}
