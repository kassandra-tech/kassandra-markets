import { ExchangeMarket } from "src/markets/entities/exchange.market.entity";
import { ExchangeMarkets } from "src/markets/entities/exchange.markets.entity";
import { Exchanges } from "src/markets/enums/exchanges.enum";
import { MarketsData } from "src/markets/markets.data";
import { BinanceMarket } from "../markets/entities/market.binance.entity";

const BinanceInterface = require('binance-api-node');
const binance = BinanceInterface.default({
    apiKey: process.env.BINANCE_API_KEY,
    apiSecret: process.env.BINANCE_API_SECRET
  });

/**
 * Provides access to Binance data.
 */
export class Binance {
    public name: Exchanges;
    private marketsData: MarketsData = new MarketsData();

    constructor() {
        this.name = Exchanges['Binance'];
    }

    /**
     * Get supported markets from Biance.
     * @returns ExchangeMarkets record with supported Binance markets.
     */
    public async getMarkets(): Promise<ExchangeMarkets> {
        try {
            var exchangeMarkets: ExchangeMarket[] = [];
            
            var record = await this.marketsData.getExchangeMarketsRecord(this.name);

            if (record !== undefined) {
                exchangeMarkets = record.markets;
            } else {
                const exchangeInfo = await binance.exchangeInfo();

                var markets = exchangeInfo.symbols;
                Array.from(markets).forEach(function(binanceMarket: BinanceMarket) {
                    exchangeMarkets.push(new ExchangeMarket(binanceMarket.symbol, binanceMarket.baseAsset, binanceMarket.quoteAsset));
                });

                this.marketsData.saveExchangeMarkets(this.name, new ExchangeMarkets(this.name, exchangeMarkets));
            }

            return new ExchangeMarkets(this.name, exchangeMarkets);
        } catch (error) {
            console.log(error);
        }
    }
}