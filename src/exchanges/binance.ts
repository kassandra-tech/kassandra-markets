import { ExchangeMarket } from "src/markets/entities/exchange.market.entity";
import { ExchangeMarkets } from "src/markets/entities/exchange.markets.entity";
import { Exchanges } from "src/enums/exchanges.enum";
import { MarketsData } from "src/markets/markets.data";
import { BinanceMarket } from "../markets/entities/market.binance.entity";
import { PriceData } from "src/price/price.data";
import { MarketPrice } from "src/price/entities/market.price.entity";

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
    private price: PriceData = new PriceData();

    private exchangeMarkets: ExchangeMarket[] = [];
    private marketList: string[] = [];
    private currentPrices: MarketPrice[] = [];

    constructor() {
        this.name = Exchanges['Binance'];
        this.MarketUpdates();
    }

    /**
     * Get supported markets from Biance.
     * @returns ExchangeMarkets record with supported Binance markets.
     */
    public async getMarkets(): Promise<ExchangeMarkets> {
        try {
            var record = await this.marketsData.getExchangeMarketsRecord(this.name);

            if (record !== undefined) {
                this.exchangeMarkets = record.markets;
            } else {
                const exchangeInfo = await binance.exchangeInfo();

                var markets = exchangeInfo.symbols;
                Array.from(markets).forEach(function (binanceMarket: BinanceMarket) {
                    this.exchangeMarkets.push(new ExchangeMarket(binanceMarket.symbol, binanceMarket.baseAsset, binanceMarket.quoteAsset));
                });

                this.marketsData.saveExchangeMarkets(this.name, new ExchangeMarkets(this.name, this.exchangeMarkets));
            }

            return new ExchangeMarkets(this.name, this.exchangeMarkets);
        } catch (error) {
            console.log(error);
        }
    }

    private async MarketUpdates() {
        var updateTime = Date.now();

        await this.updateMarketsList();

        binance.ws.trades(this.marketList, (trade) => {
            var market = this.exchangeMarkets.find(market => market.format === trade.symbol);

            var currentPrice: MarketPrice;
            if (currentPrice = this.currentPrices.find(record => record.market === market.market)) {
                currentPrice.update(trade);
            } else {
                currentPrice = new MarketPrice(market.market, trade);
                this.currentPrices.push(currentPrice);
            }

            if (Date.now() > updateTime + 500) {
                updateTime = Date.now();
                this.price.saveCurrentPriceRecord(this.name, this.currentPrices);
            }
        });
    }

    private async updateMarketsList() {
        var exchangeMarket = await this.getMarkets();

        exchangeMarket.markets.forEach((market) => {
            this.marketList.push(market.format);
        })
    }
}