import { ExchangeMarket } from "src/markets/entities/exchange.market.entity";
import { ExchangeMarkets } from "src/markets/entities/exchange.markets.entity";
import { Exchanges } from "src/enums/exchanges.enum";
import { CoinbaseMarket } from "src/markets/entities/market.coinbase.entity";
import { MarketsData } from "src/markets/markets.data";

const CoinbaseInterface = require('coinbase-pro-node');
const coinbase = new CoinbaseInterface.default();

/**
 * Provides access to Coinbase data.
 */
export class Coinbase {
    public name: Exchanges;
    private marketsData: MarketsData = new MarketsData();

    constructor() {
        this.name = Exchanges['Coinbase'];
    }

    /**
     * Get supported markets from Coinbase.
     * @returns ExchangeMarkets record with supported Coinbase markets.
     */
    public async getMarkets(): Promise<ExchangeMarkets> {
        try {
            var exchangeMarkets: ExchangeMarket[] = [];

            var record = await this.marketsData.getExchangeMarketsRecord(this.name);

            if (record !== undefined) {
                exchangeMarkets = record.markets;
            } else {
                const markets = await coinbase.rest.product.getProducts();

                Array.from(markets).forEach(function (coinbaseMarket: CoinbaseMarket) {
                    exchangeMarkets.push(new ExchangeMarket(coinbaseMarket.display_name, coinbaseMarket.base_currency, coinbaseMarket.quote_currency));
                });

                this.marketsData.saveExchangeMarkets(this.name, new ExchangeMarkets(this.name, exchangeMarkets));
            }

            return new ExchangeMarkets(this.name, exchangeMarkets);
        } catch (error) {
            console.log(error);
        }
    }
}
