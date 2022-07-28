import { Injectable } from '@nestjs/common';
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
    private priceRecordSaved: boolean = false;

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

            await query.find().then(priceRecord => {
                var record = priceRecord[0];
                if (record !== undefined) {
                    record.set(Definitions.pricesString, trades);
                    record.save();
                } else if (!this.priceRecordSaved) {
                    var marketObj = new MarketObj();
                    marketObj.set(Definitions.exchangeString, exchange);
                    marketObj.set(Definitions.pricesString, trades);
                    marketObj.save();

                    this.priceRecordSaved = true;
                }
            });
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

            await query.first().then(priceRecord => {
                if (priceRecord !== undefined) {
                    prices = priceRecord.get(Definitions.pricesString);

                    return new CurrentPrices(exchange, prices);
                }
            });

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
        var MarketObj = Moralis.Object.extend(Definitions.PricesString);
        var marketObj = new MarketObj();
        marketObj.set(Definitions.exchangeString, exchange);
        marketObj.set(Definitions.pricesString, trades);
        marketObj.save();
    }

    public async getPriceRecord(exchange: Exchanges): Promise<Prices> {
        try {
            var prices: Price[] = [];
            var MarketObj = Moralis.Object.extend(Definitions.PricesString);
            var query = new Moralis.Query(MarketObj);
            query.equalTo(Definitions.exchangeString, exchange);
            query.descending(Definitions.createdAtString);

            await query.first().then(priceRecord => {
                if (priceRecord !== undefined) {
                    prices = priceRecord.get(Definitions.pricesString);

                    return new Prices(exchange, prices);
                }
            });

            return new Prices(exchange, prices);
        } catch (error) {
            console.log(error);
        }
    }
}
