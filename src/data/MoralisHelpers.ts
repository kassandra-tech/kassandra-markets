import { Exchanges } from "src/enums/exchanges.enum";
import { Base } from "./Base";
import { TimeHelpers } from "./TimeHelpers";

const Moralis = require("moralis/node");
const time = new TimeHelpers();

/**
 * Provides access to storing data in the Kassandra datastore.
 */
export class MoralisHelpers extends Base {
    /**
     * Get Kassandra data objects from the Kassandra datastore.
     * Note: Desired properties will need to be read from the returned objects.
     * @param objectName Name of the database class to get data from.
     * @param exchange Exchange to get data from.
     * @param minutesBefore Number of minutes before the current time to return data from. 
     * @returns Requested objects from the Kassandra datastore.
     */
    public async getKassandraObjects(objectName: string, exchange: Exchanges, minutesBefore: number) {
        try {
            var kassandraObject = Moralis.Object.extend(objectName);
            var query = new Moralis.Query(kassandraObject);
            query.equalTo(this.Definitions.exchangeString, exchange);
            query.descending(this.Definitions.updatedAtString);
            query.greaterThan(this.Definitions.updatedAtString, time.getMinutesBefore(minutesBefore));

            return await query.find();
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Get Kassandra data from the Kassandra datastore.
     * @param objectName Name of the database class to get data from.
     * @param returnPropertyName Property name in the database class to get data from.
     * @param exchange Exchange to get data from.
     * @param isDescending When true, the most recent data will be returned.
     * @returns Requested data from the Kassandra datastore.
     */
    public async getKassandraData(objectName: string, returnPropertyName: string, exchange: Exchanges = Exchanges.All, isDescending = true) {
        try {
            var kassandraObject = Moralis.Object.extend(objectName);
            var query = new Moralis.Query(kassandraObject);

            if (exchange !== Exchanges.All) {
                query.equalTo(this.Definitions.exchangeString, exchange);
            }

            if (isDescending) {
                query.descending(this.Definitions.updatedAtString);
            } else {
                query.ascending(this.Definitions.updatedAtString);
            }

            var result = await query.first();

            if (result !== undefined) {
                return result.get(returnPropertyName);
            }
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Save data to the Kassandra datastore.
     * @param objectName Name of the database class save data.
     * @param savePropertyName Property name in the database class to save data.
     * @param objectToSave Object to save in the savePropertyName field.
     * @param exchange Exchange to save data.
     */
    public async saveKassandraData(objectName: string, savePropertyName: string, objectToSave, exchange: Exchanges = Exchanges.All) {
        try {
            if (objectToSave.length > 0) {
                const kassandraObject = Moralis.Object.extend(objectName);
                const property = new kassandraObject();

                property.set(savePropertyName, objectToSave);

                if (exchange !== Exchanges.All) {
                    property.set(this.Definitions.exchangeString, exchange);
                }

                await property.save();
            }
        } catch (error) {
            console.log(error);
        }
    }
}
