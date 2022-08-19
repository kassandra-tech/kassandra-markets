import { ExchangeMarket } from "src/markets/entities/exchange.market.entity";
import { ExchangeMarkets } from "src/markets/entities/exchange.markets.entity";
import { Exchanges } from "src/enums/exchanges.enum";
import { CoinbaseMarket } from "src/exchanges/entities/market.coinbase.entity";
import { MarketsData } from "src/markets/markets.data";

const CoinbaseInterface = require('coinbase-pro-node');
const coinbase = new CoinbaseInterface.default();

/**
 * Provides access to Coinbase data.
 */
export class Coinbase {
    public name: Exchanges;
    public marketsData: MarketsData;
    private exchangeMarkets: ExchangeMarket[];

    constructor() {
        this.name = Exchanges.Coinbase;
        this.marketsData = new MarketsData();
        this.exchangeMarkets = [];

        this.getMarkets();
    }

    /**
     * Get supported markets from Coinbase.
     * @returns ExchangeMarkets record with supported Coinbase markets.
     */
    public async getMarkets(): Promise<ExchangeMarkets> {
        try {
            const markets: CoinbaseMarket[] = await coinbase.rest.product.getProducts();

            if (markets !== undefined) {
                markets.forEach(market => {
                    var exchangeMarket = new ExchangeMarket(market.display_name, market.base_currency, market.quote_currency);
                    this.exchangeMarkets.push(exchangeMarket);
                });
            }

            return new ExchangeMarkets(this.name, this.exchangeMarkets);
        } catch (error) {
            console.log(error);
        }
    }
}
