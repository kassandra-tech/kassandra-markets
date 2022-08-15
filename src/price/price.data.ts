import { Injectable } from '@nestjs/common';
import { KassandraData } from 'src/data/KassandraData';
import { Exchanges } from 'src/enums/exchanges.enum';
import { CurrentPrice } from './entities/current.price.entity';
import { CurrentPrices } from './entities/current.prices.entity';
import { Price } from './entities/price.entity';
import { Prices } from './entities/prices.entity';

const Moralis = require("moralis/node");

/**
 * Interact with the Kassandra datastore to retrieve and store market data.
 */
@Injectable()
export class PriceData extends KassandraData {
    /**
     * Save the current prices for all markets for the provided exchange.
     * @param exchange Exchanges to get the current market prices from.
     * @param trades MarketPrices for all markets on the exchange.
     */
    public async saveCurrentPriceRecord(exchange: Exchanges, trades: CurrentPrice[]) {
        try {
            var MarketObj = Moralis.Object.extend(this.Definitions.PriceString);
            var query = new Moralis.Query(MarketObj);
            query.equalTo(this.Definitions.exchangeString, exchange);
            query.ascending(this.Definitions.updatedAtString);

            var records = await query.find();

            if (records === undefined) {
                console.log(exchange + ": current price not found");
            } else if (records.length < 10) {
                var marketObj = new MarketObj();
                marketObj.set(this.Definitions.exchangeString, exchange);
                marketObj.set(this.Definitions.pricesString, trades);

                await marketObj.save();
            } else if (records.length > 0) {
                records[0].set(this.Definitions.pricesString, trades);
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
            var prices: CurrentPrice[] = await this.getKassandraData(this.Definitions.PriceString, this.Definitions.pricesString, exchange);

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
        await this.saveKassandraData(this.Definitions.PricesString, this.Definitions.pricesString, trades, exchange)
    }

    /**
     * Get the price record(s) for the requested exchange.
     * When minutes are larget than 1, all records between the current time and number of minutes requested will be returned and combined.
     * @param exchange Exchange to return price records for.
     * @param minutes Number of minutes before the current time to find records for.
     * @returns 
     */
    public async getPriceRecord(exchange: Exchanges, minutes: number = 1): Promise<Prices> {
        try {
            var prices: Price[] = [];

            var records = await this.getKassandraObjects(this.Definitions.PricesString, minutes, exchange);

            if (records === undefined) {
                console.log(exchange + ": unable to get price record");
            } else if (records.length > 0) {
                records.forEach(record => {
                    var recordPrices: Price[] = record.get(this.Definitions.pricesString);

                    recordPrices.forEach(priceRecord => {
                        var price = prices.find(price => price.market === priceRecord.market);

                        if (price !== undefined) {
                            price.updatePriceData(priceRecord.price, priceRecord.lowPrice, priceRecord.highPrice, priceRecord.buyVolume, priceRecord.sellVolume, priceRecord.volume);
                        } else {
                            var newPrice = new Price(priceRecord.market);
                            newPrice.updatePriceData(priceRecord.price, priceRecord.lowPrice, priceRecord.highPrice, priceRecord.buyVolume, priceRecord.sellVolume, priceRecord.volume);
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
