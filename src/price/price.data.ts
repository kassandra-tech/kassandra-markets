import { Injectable } from '@nestjs/common';
import { Exchanges } from 'src/enums/exchanges.enum';
import { DataDefinitions } from '../data/DataDefinitions';
import { MarketPrice } from './entities/market.price.entity';
import { MarketPrices } from './entities/market.prices.entity';

const Moralis = require("moralis/node");
const Definitions = new DataDefinitions();

/**
 * Interact with the Kassandra datastore to retrieve and store market data.
 */
@Injectable()
export class PriceData {
    /**
     * Save the current prices for all updated markets for the provided exchange.
     * @param exchange 
     * @param trades 
     */
    public async saveCurrentPriceRecord(exchange: Exchanges, trades: MarketPrice[]) {
        try {
            var MarketObj = Moralis.Object.extend(Definitions.PriceString);
            var query = new Moralis.Query(MarketObj);
            query.equalTo(Definitions.exchangeString, exchange);

            var result = await query.first();

            if (result !== undefined) {
                result.set(Definitions.exchangeString, exchange);
                result.set(Definitions.pricesString, trades);
                result.save();
            } else {
                var marketObj = new MarketObj();
                marketObj.set(Definitions.exchangeString, exchange);
                marketObj.set(Definitions.pricesString, trades);
                marketObj.save();
            }
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Save the current prices for all updated markets for the provided exchange.
     * @param exchange 
     */
    public async getCurrentPriceRecord(exchange: Exchanges): Promise<MarketPrices> {
        try {
            var prices: MarketPrice[] = [];
            var MarketObj = Moralis.Object.extend(Definitions.PriceString);
            var query = new Moralis.Query(MarketObj);
            query.equalTo(Definitions.exchangeString, exchange);

            var result = await query.first();

            if (result !== undefined) {
                prices = result.get(Definitions.pricesString);

                return new MarketPrices(exchange, prices);
            }

            return new MarketPrices(exchange, prices);
        } catch (error) {
            console.log(error);
        }
    }
}
