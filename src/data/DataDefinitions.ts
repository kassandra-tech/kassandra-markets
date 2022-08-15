/**
 * Definitions for accessing data from the Kassandra datastore.
 */
export class DataDefinitions {
    /**
     * Kassandra objects
     */

    /**
     * CurrencyInformation
     */
    CurrencyInformationString: string;

    /**
     * Currencies
     */
    CurrenciesString: string;

    /**
     * Markets
     */
    MarketsString: string;

    /**
     * Price
     */
    PriceString: string;

    /**
     * Prices
     */
    PricesString: string;

    /**
     * Kassandra object properties
     */

    /**
     * exchange
     */
    exchangeString: string;

    /**
     * currencies
     */
    currenciesString: string;

    /**
     * markets
     */
    marketsString: string;

    /**
     * prices
     */
    pricesString: string;

    /**
     * Moralis properties
     */

    /**
     * createdAt
     */
    createdAtString: string;

    /**
     * updatedAt
     */
    updatedAtString: string;

    constructor() {
        this.CurrencyInformationString = "CurrencyInformation";
        this.CurrenciesString = "Currencies";
        this.MarketsString = "Markets";
        this.PriceString = "Price";
        this.PricesString = "Prices";

        this.exchangeString = "exchange";
        this.currenciesString = "currencies";
        this.marketsString = "markets";
        this.pricesString = "prices";

        this.createdAtString = "createdAt";
        this.updatedAtString = "updatedAt";
    }

    /**
     * Format numbers with 8 decimal places.
     * @param amount number to format.
     * @returns formatted number with 8 decimal places.
     */
    public cryptoNumberFormat(amount: number): number {
        try {
            if (amount === null || amount === undefined) {
                amount = 0;
            }
            return parseFloat(parseFloat(amount.toString()).toFixed(8));
        } catch (error) {
            console.log(error);
        }
    }
}
