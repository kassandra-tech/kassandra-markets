import { DataDefinitions } from "src/data/DataDefinitions";
import { Trade } from "./trade.entity";

var Data = new DataDefinitions();

/**
 * Record that contains the name of the exchange with associated exchange markets.
 */
export class Price {

    market: string;

    /**
     * Price for the trade.
     */
    price: number;

    /**
     * Lowest price for the market in the time range.
     */
    lowPrice: number;

    /**
     * Highest price for the market in the time range.
     */
    highPrice: number;

    /**
     * Amount of the currency purchased in the time range.
     */
    buyVolume: number;

    /**
     * Amount of currency sold in the time range.
     */
    sellVolume: number;

    /**
     * Total amount of currency bought and sold.
     */
    volume: number;

    public constructor(market: string, trade: Trade) {
        this.market = market;
        this.lowPrice = Data.cryptoNumberFormat(trade.price);
        this.highPrice = Data.cryptoNumberFormat(trade.price);
        this.buyVolume = Data.cryptoNumberFormat(0.00000000);
        this.sellVolume = Data.cryptoNumberFormat(0.00000000);
        this.volume = Data.cryptoNumberFormat(0.00000000);

        this.update(trade);
    }

    /**
     * Update price and volume properties of the market.
     * @param trade Trade to update market price and volume information from.
     */
    public update(trade: Trade) {
        try {
            var price = Data.cryptoNumberFormat(trade.price);
            var amount = Data.cryptoNumberFormat(trade.quantity);

            if (price < this.lowPrice) {
                this.lowPrice = price;
            } else if (price > this.highPrice) {
                this.highPrice = price;
            }

            if (trade.isBuyerMaker) {
                this.buyVolume = Data.cryptoNumberFormat(this.buyVolume + amount);
            } else {
                this.sellVolume = Data.cryptoNumberFormat(this.sellVolume + amount);
            }

            this.volume = Data.cryptoNumberFormat(this.volume + amount);
        } catch (error) {
            console.log(error);
        }
    }
}
