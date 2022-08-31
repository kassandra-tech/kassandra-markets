import { ExchangeMarket } from "src/markets/entities/exchange.market.entity";
import { ExchangeMarkets } from "src/markets/entities/exchange.markets.entity";
import { Exchanges } from "src/enums/exchanges.enum";
import { CoinbaseMarket } from "src/exchanges/entities/market.coinbase.entity";
import { MarketsData } from "src/markets/markets.data";
import { CoinbasePro, WebSocketChannel, WebSocketChannelName, WebSocketEvent } from 'coinbase-pro-node';
import { TimeHelpers } from "src/data/TimeHelpers";
import { PriceData } from "src/price/price.data";
import { CurrentPrice } from "src/price/entities/current.price.entity";
import { Price } from "src/price/entities/price.entity";
import { Trade } from "src/price/entities/trade.entity";
import { DataDefinitions } from "src/data/DataDefinitions";
import { Prices } from "src/price/entities/prices.entity";

const coinbase = new CoinbasePro();
var helpers: DataDefinitions = new DataDefinitions();

/**
 * Provides access to Coinbase data.
 */
export class Coinbase {
    public name: Exchanges;
    public marketsData: MarketsData;
    public priceData: PriceData;
    private exchangeMarkets: ExchangeMarket[] = [];
    private currentPrices: CurrentPrice[] = [];
    private prices: Price[] = [];

    constructor() {
        this.name = Exchanges.Coinbase;
        this.marketsData = new MarketsData();
        this.priceData = new PriceData();

        this.update();
    }

    /**
     * Get supported market symbols.
     * @returns Market symbols for the exchange.
     */
    public getMarketSymbols(): string[] {
        return this.exchangeMarkets.map(market => market.market);
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

    private async update() {
        var currentPriceTime = new TimeHelpers();
        var priceTime = new TimeHelpers();
        var priceRecordTime = new TimeHelpers();

        var marketsFormat = await this.getMarketsFormat();

        const channel: WebSocketChannel = {
            name: WebSocketChannelName.TICKER,
            product_ids: marketsFormat
        };

        coinbase.ws.subscribe(channel);
        coinbase.ws.on(WebSocketEvent.ON_MESSAGE, async update => {
            try {
                if (update.type === "ticker") {
                    var trade = new Trade();
                    trade.price = helpers.cryptoNumberFormat(+update.price);
                    trade.isBuyerMaker = update.side === "buy";
                    trade.quantity = helpers.cryptoNumberFormat(+update.last_size);
                    trade.tradeTime = helpers.cryptoNumberFormat(+update.time);

                    var market = this.exchangeMarkets.find(market => market.market === update.product_id);
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
                } else if (update.type === "error") {
                    console.log(update);
                }
            } catch (error) {
                console.log(error);
            }
        });
        coinbase.ws.connect();
    }

    private async getMarketsFormat() {
        var exchangeFormatMarkets: string[] = [];

        try {
            var exchangeMarket = await this.getMarkets();

            if (exchangeMarket !== undefined) {
                exchangeMarket.markets.forEach((market) => {
                    exchangeFormatMarkets.push(market.market);
                })
            }
        } catch (error) {
            console.log(error);
        }

        return exchangeFormatMarkets;
    }
}
