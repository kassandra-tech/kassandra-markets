import { Injectable } from '@nestjs/common';
import { Data } from 'src/data/Data';
import { Exchanges } from 'src/enums/exchanges.enum';
import { DataDefinitions } from '../data/DataDefinitions';
import { CurrentPrice } from './entities/current.price.entity';
import { CurrentPrices } from './entities/current.prices.entity';
import { Price } from './entities/price.entity';
import { Prices } from './entities/prices.entity';

const Moralis = require("moralis/node");
const Definitions = new DataDefinitions();

/**
 * Interact with the Kassandra datastore to retrieve and store market data.
 */
@Injectable()
export class PriceData {
    private data: Data = new Data();

    /**
     * Save the current prices for all markets for the provided exchange.
     * @param exchange Exchanges to get the current market prices from.
     * @param trades MarketPrices for all markets on the exchange.
     */
    public async saveCurrentPriceRecord(exchange: Exchanges, trades: CurrentPrice[]) {
        try {
            var MarketObj = Moralis.Object.extend(Definitions.PriceString);
            var query = new Moralis.Query(MarketObj);
            query.equalTo(Definitions.exchangeString, exchange);
            query.ascending(Definitions.updatedAtString);

            var records = await query.find();

            if (records === undefined) {
                console.log(exchange + ": current price not found");
            } else if (records.length < 10) {
                var marketObj = new MarketObj();
                marketObj.set(Definitions.exchangeString, exchange);
                marketObj.set(Definitions.pricesString, trades);

                await marketObj.save();
            } else if (records.length > 0) {
                records[0].set(Definitions.pricesString, trades);
                await records[0].save();
            }
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Save the current prices for all updated markets for the provided exchange.
     * @param exchange 
     */
    public async getCurrentPriceRecord(exchange: Exchanges): Promise<CurrentPrices> {
        try {
            var prices: CurrentPrice[] = [];
            var MarketObj = Moralis.Object.extend(Definitions.PriceString);
            var query = new Moralis.Query(MarketObj);
            query.equalTo(Definitions.exchangeString, exchange);
            query.descending(Definitions.updatedAtString);

            var record = await query.first();

            if (record !== undefined) {
                prices = record.get(Definitions.pricesString);
            } 

            return new CurrentPrices(exchange, prices);
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Save prices for all markets for the provided exchange.
     * @param exchange Exchanges to get the current market prices from.
     * @param trades Prices for markets on the exchange.
     */
    public async savePriceRecord(exchange: Exchanges, trades: Price[]) {
        try {
            var MarketObj = Moralis.Object.extend(Definitions.PricesString);
            var marketObj = new MarketObj();
            marketObj.set(Definitions.exchangeString, exchange);
            marketObj.set(Definitions.pricesString, trades);

            await marketObj.save();
        } catch (error) {
            console.log(error);
        }
    }

    public async getPriceRecord(exchange: Exchanges, minutes: number = 1): Promise<Prices> {
        try {
            var prices: Price[] = [];
            var MarketObj = Moralis.Object.extend(Definitions.PricesString);
            var query = new Moralis.Query(MarketObj);
            query.equalTo(Definitions.exchangeString, exchange);
            query.greaterThan(Definitions.updatedAtString, this.data.getMinutesBefore(minutes));
            query.descending(Definitions.createdAtString);

            var records = await query.find();

            if (records === undefined) {
                console.log(exchange + ": unable to get price record");
            } else if (records.length > 0) {
                records.forEach(record => {
                    var recordPrices: Price[] = record.get(Definitions.pricesString);

                    recordPrices.forEach(priceRecord => {
                        var price = prices.find(price => price.market === priceRecord.market);

                        if (price !== undefined) {
                            price.updatePrice(priceRecord);
                        } else {
                            var newPrice = new Price(priceRecord.market);
                            newPrice.updatePrice(priceRecord);
                            prices.push(newPrice);
                        }
                    })
                });
            }

            return new Prices(exchange, prices);
        } catch (error) {
            console.log(error);
        }
    }
}
