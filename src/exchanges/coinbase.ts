import { ExchangeMarket } from "src/markets/entities/exchange.market.entity";
import { ExchangeMarkets } from "src/markets/entities/exchange.markets.entity";
import { Exchanges } from "src/markets/enums/exchanges.enum";
import { CoinbaseMarket } from "../markets/entities/market.coinbase.entity";

const CoinbaseInterface = require('coinbase-pro-node');
const coinbase = new CoinbaseInterface.default();

/**
 * Provides access to Coinbase data.
 */
export class Coinbase {
    name: Exchanges;

    constructor() {
        this.name = Exchanges['Coinbase'];
    }

    /**
     * Get supported markets from Coinbase.
     * @returns ExchangeMarkets record with supported Coinbase markets.
     */
    public async getMarkets(): Promise<ExchangeMarkets> {
        try {
            const markets = await coinbase.rest.product.getProducts();
            var list = [];

            Array.from(markets).forEach(function(coinbaseMarket: CoinbaseMarket) {
                list.push(new ExchangeMarket(coinbaseMarket.display_name, coinbaseMarket.base_currency, coinbaseMarket.quote_currency));
            });

            return new ExchangeMarkets(this.name, list);
        } catch (error) {
            console.log(error);
        }
    }
}
