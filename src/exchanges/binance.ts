import { ExchangeMarket } from "src/markets/entities/exchange.market.entity";
import { ExchangeMarkets } from "src/markets/entities/exchange.markets.entity";
import { Exchanges } from "src/enums/exchanges.enum";
import { MarketsData } from "src/markets/markets.data";
import { BinanceMarket } from "./entities/market.binance.entity";
import { PriceData } from "src/price/price.data";
import { CurrentPrice } from "src/price/entities/current.price.entity";
import { Price } from "src/price/entities/price.entity";
import { CurrencyInformation } from "src/markets/entities/currency.information.entity";
import { Prices } from "src/price/entities/prices.entity";
import { PriceTrigger } from "src/data/PriceTrigger";

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
    private currencyInfo: CurrencyInformation[] = [];
    private marketList: string[] = [];
    private currentPrices: CurrentPrice[] = [];
    private prices: Price[] = [];

    constructor() {
        this.name = Exchanges.Binance;
        this.MarketUpdates();
    }

    /**
     * Get supported markets from Biance.
     * @returns ExchangeMarkets record with supported Binance markets.
     */
    public async getMarkets(): Promise<ExchangeMarkets> {
        try {
            var record = await this.marketsData.getExchangeMarketRecord(this.name);

            if (record !== undefined) {
                this.exchangeMarkets = record.markets;
            } else {
                const exchangeInfo = await binance.exchangeInfo();

                var markets: BinanceMarket[] = exchangeInfo.symbols;
                markets.forEach(market => {
                    var exchangeMarket = new ExchangeMarket(market.symbol, market.baseAsset, market.quoteAsset);
                    var info = this.currencyInfo.find(info => info.symbol === exchangeMarket.currency);
                    exchangeMarket.updateCurrencyInformation(info);

                    this.exchangeMarkets.push(exchangeMarket);
                });

                await this.marketsData.saveExchangeMarkets(this.name, new ExchangeMarkets(this.name, this.exchangeMarkets));
            }

            return new ExchangeMarkets(this.name, this.exchangeMarkets);
        } catch (error) {
            console.log(error);
        }
    }

    private async MarketUpdates() {
        var currentPriceTime = new PriceTrigger();
        var priceTime = new PriceTrigger();
        var priceRecordTime = new PriceTrigger();

        var currentPrice: CurrentPrice;
        var price: Price;

        await this.updateMarketsList();
        await this.updateCurrencyInformation();

        binance.ws.trades(this.marketList, async (trade) => {
            try {
                var market = this.exchangeMarkets.find(market => market.format === trade.symbol);

                if (currentPrice = this.currentPrices.find(record => record.market === market.market)) {
                    currentPrice.update(trade);
                } else {
                    currentPrice = new CurrentPrice(market.market, trade);
                    this.currentPrices.push(currentPrice);
                }

                if (currentPriceTime.secondUpdate(1)) {
                    await this.price.saveCurrentPriceRecord(this.name, this.currentPrices);
                }

                if (price = this.prices.find(record => record.market === market.market)) {
                    price.update(trade);
                } else {
                    price = new Price(currentPrice.market, trade);
                    this.prices.push(price);
                }

                if (priceTime.minuteUpdate(1)) {
                    await this.price.savePriceRecord(this.name, this.prices);

                    this.prices = [];
                }

                if (priceRecordTime.minuteUpdate(5)) {
                    var prices: Prices = await this.price.getPriceRecord(this.name, 5);

                    if (prices !== undefined && prices.prices.length > 0) {
                        await this.marketsData.saveMarketRecord(this.name, this.exchangeMarkets, this.currentPrices, prices);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        });
    }

    private async updateMarketsList() {
        var exchangeMarket = await this.getMarkets();

        exchangeMarket.markets.forEach((market) => {
            this.marketList.push(market.format);
        })
    }

    private async updateCurrencyInformation() {
        this.currencyInfo = await this.marketsData.getCurrencyInformation();
    }
}
