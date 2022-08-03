/**
 * Kassandra definitions for accessing data from the Kassandra datastore.
 */
export class DataDefinitions {
    CurrenciesString: string;
    currenciesString: string;
    CurrencyInformationString: string;
    ExchangeMarketString: string;
    MarketsString: string;
    marketsString: string;
    marketRecordString: string;
    MarketExchangesString: string;
    PriceString: string;
    PricesString: string;
    pricesString: string;
    createdAtString: string;
    exchangeString: string;
    updatedAtString: string;

    constructor() {
        this.CurrenciesString = "Currencies";
        this.currenciesString = "currencies";
        this.CurrencyInformationString = "CurrencyInformation";

        this.ExchangeMarketString = "ExchangeMarket";
        this.MarketsString = "Markets";
        this.marketsString = "markets";
        this.marketRecordString = "MarketRecord";

        this.MarketExchangesString = "MarketExchanges";

        this.PriceString = "Price";
        this.PricesString = "Prices";
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
        return parseFloat(parseFloat(amount.toString()).toFixed(8));
    }
}
