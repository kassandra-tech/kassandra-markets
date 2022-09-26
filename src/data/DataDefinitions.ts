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
    public CurrencyInformationString: string = "CurrencyInformation";

    /**
     * Currencies
     */
    public CurrenciesString: string = "Currencies";

    /**
     * Markets
     */
    public MarketsString: string= "Markets";

    /**
     * Price
     */
    public PriceString: string= "Price";

    /**
     * Prices
     */
    public PricesString: string = "Prices";

    /**
     * Kassandra object properties
     */

    /**
     * exchange
     */
    public exchangeString: string = "exchange";

    /**
     * currencies
     */
    public currenciesString: string = "currencies";

    /**
     * markets
     */
    public marketsString: string = "markets";

    /**
     * prices
     */
    public pricesString: string = "prices";

    /**
     * Moralis properties
     */

    /**
     * createdAt
     */
    public createdAtString: string = "createdAt";

    /**
     * updatedAt
     */
    public updatedAtString: string = "updatedAt";

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
