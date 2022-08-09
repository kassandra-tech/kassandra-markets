/**
 * Definitions for accessing data from the Kassandra datastore.
 */
export class DataDefinitions {
    /**
     * Kassandra objects
     */

    CurrencyInformationString: string;
    CurrenciesString: string;
    ExchangeMarketString: string;
    MarketsString: string;
    PriceString: string;
    PricesString: string;

    /**
     * Kassandra object properties
     */

    currenciesString: string;
    marketsString: string;
    MarketRecordString: string;
    pricesString: string;

    /**
     * Moralis properties
     */
    createdAtString: string;
    exchangeString: string;
    updatedAtString: string;

    constructor() {
        this.CurrencyInformationString = "CurrencyInformation";
        this.CurrenciesString = "Currencies";
        this.ExchangeMarketString = "ExchangeMarket";
        this.MarketsString = "Markets";
        this.MarketRecordString = "MarketRecord";
        this.PriceString = "Price";
        this.PricesString = "Prices";

        this.currenciesString = "currencies";
        this.marketsString = "markets";
        this.pricesString = "prices";

        this.createdAtString = "createdAt";
        this.exchangeString = "exchange";
        this.updatedAtString = "updatedAt";
    }

    /**
     * Format numbers with 8 decimal places.
     * @param amount number to format.
     * @returns formatted number with 8 decimal places.
     */
    public cryptoNumberFormat(amount: number): number {
        if (amount === null) {
            amount = 0;
        }
        return parseFloat(parseFloat(amount.toString()).toFixed(8));
    }
}
