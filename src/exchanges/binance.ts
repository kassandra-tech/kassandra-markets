import { ExchangeMarket } from "src/markets/entities/exchange.market.entity";
import { ExchangeMarkets } from "src/markets/entities/exchange.markets.entity";
import { Exchanges } from "src/enums/exchanges.enum";
import { MarketsData } from "src/markets/markets.data";
import { BinanceMarket } from "./entities/market.binance.entity";
import { PriceData } from "src/price/price.data";
import { CurrentPrice } from "src/price/entities/current.price.entity";
import { Price } from "src/price/entities/price.entity";
import { Prices } from "src/price/entities/prices.entity";
import { TimeHelpers } from "src/data/TimeHelpers";

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
    public marketsData: MarketsData;
    public priceData: PriceData;
    private exchangeMarkets: ExchangeMarket[];
    private currentPrices: CurrentPrice[];
    private prices: Price[];

    constructor() {
        this.name = Exchanges.Binance;
        this.marketsData = new MarketsData();
        this.priceData = new PriceData();
        this.exchangeMarkets = [];
        this.currentPrices = [];
        this.prices = [];

        this.update();
    }

    /**
     * Get supported markets from Biance.
     * @returns ExchangeMarkets record with supported Binance markets.
     */
    public async getMarkets(): Promise<ExchangeMarkets> {
        try {
            const exchangeInfo = await binance.exchangeInfo();

            var markets: BinanceMarket[] = exchangeInfo.symbols;
            if (markets !== undefined) {
                markets.forEach(market => {
                    var exchangeMarket = new ExchangeMarket(market.symbol, market.baseAsset, market.quoteAsset);
                    this.exchangeMarkets.push(exchangeMarket);
                })
            }

            return new ExchangeMarkets(this.name, this.exchangeMarkets);
        } catch (error) {
            console.log(error);
        }
    }

    private async update() {
        var currentPriceTime = new TimeHelpers();
        var priceTime = new TimeHelpers();
        var priceRecordTime = new TimeHelpers();

        var marketsFormat = await this.getMarketsFormat();

        binance.ws.trades(marketsFormat, async (trade) => {
            try {
                var market = this.exchangeMarkets.find(market => market.format === trade.symbol);
                var marketName = "";
                if (market !== undefined) {
                    marketName = market.market;
                }

                var currentPrice = this.currentPrices.find(record => record.market === marketName);
                if (currentPrice !== undefined) {
                    currentPrice.updatePrice(trade);
                } else {
                    currentPrice = new CurrentPrice(marketName, trade);
                    this.currentPrices.push(currentPrice);
                }

                if (currentPriceTime.secondUpdate(1)) {
                    await this.priceData.saveCurrentPriceRecord(this.name, this.currentPrices);
                }

                price = this.prices.find(record => record.market === marketName);
                if (price !== undefined) {
                    price.updateTrade(trade);
                } else {
                    var price = new Price(currentPrice.market).updateTrade(trade);
                    this.prices.push(price);
                }

                if (priceTime.secondUpdate(30)) {
                    await this.priceData.savePriceRecord(this.name, this.prices);

                    this.prices = [];
                }

                if (priceRecordTime.minuteUpdate(1)) {
                    var prices: Prices = await this.priceData.getPriceRecord(this.name, 1);

                    if (prices !== undefined && prices.prices.length > 0) {
                        await this.marketsData.saveMarkets(this.name, this.exchangeMarkets, prices);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        })
    }

    private async getMarketsFormat() {
        var exchangeFormatMarkets: string[] = [];

        try {
            var exchangeMarket = await this.getMarkets();

            if (exchangeMarket !== undefined) {
                exchangeMarket.markets.forEach((market) => {
                    exchangeFormatMarkets.push(market.format);
                })
            }
        } catch (error) {
            console.log(error);
        }

        return exchangeFormatMarkets;
    }
}
