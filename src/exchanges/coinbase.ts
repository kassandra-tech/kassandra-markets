import { ExchangeMarket } from "src/markets/entities/exchange.market.entity";
import { ExchangeMarkets } from "src/markets/entities/exchange.markets.entity";
import { Exchanges } from "src/enums/exchanges.enum";
import { CoinbaseMarket } from "src/exchanges/entities/market.coinbase.entity";
import { MarketsData } from "src/markets/markets.data";
import { CurrencyInformation } from "src/markets/entities/currency.information.entity";

const CoinbaseInterface = require('coinbase-pro-node');
const coinbase = new CoinbaseInterface.default();

/**
 * Provides access to Coinbase data.
 */
export class Coinbase {
    public name: Exchanges;
    private marketsData: MarketsData = new MarketsData();

    private exchangeMarkets: ExchangeMarket[] = [];
    private currencyInfo: CurrencyInformation[] = [];
    private marketList: string[] = [];

    constructor() {
        this.name = Exchanges.Coinbase;
    }

    /**
     * Get supported markets from Coinbase.
     * @returns ExchangeMarkets record with supported Coinbase markets.
     */
    public async getMarkets(): Promise<ExchangeMarkets> {
        try {
            var record = await this.marketsData.getExchangeMarketRecord(this.name);

            if (record !== undefined && record.markets.length > 0) {
                this.exchangeMarkets = record.markets;
            } else {
                if (this.marketList.length === 0) {
                    await this.updateMarketsList();
                }

                if (this.currencyInfo.length === 0) {
                    this.updateCurrencyInformation();
                }

                const markets: CoinbaseMarket[] = await coinbase.rest.product.getProducts();

                if (markets !== undefined) {
                    markets.forEach(market => {
                        var exchangeMarket = new ExchangeMarket(market.display_name, market.base_currency, market.quote_currency);
                        var info = this.currencyInfo.find(info => info.symbol === exchangeMarket.currency);
                        exchangeMarket.updateCurrencyInformation(info);

                        this.exchangeMarkets.push(exchangeMarket);
                    });

                    await this.marketsData.saveExchangeMarkets(this.name, new ExchangeMarkets(this.name, this.exchangeMarkets));
                }
            }

            return new ExchangeMarkets(this.name, this.exchangeMarkets);
        } catch (error) {
            console.log(error);
        }
    }

    private async updateMarketsList() {
        try {
            var exchangeMarket: ExchangeMarkets = await this.getMarkets();

            exchangeMarket.markets.forEach(market => {
            this.marketList.push(market.format);
        })
        } catch (error) {
            console.log(error);
        }
    }

    private async updateCurrencyInformation() {
        this.currencyInfo = await this.marketsData.getCurrencyInformation();
    }
}
