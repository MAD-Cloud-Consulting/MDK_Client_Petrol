import FetchRequest from '../../Common/Query/FetchRequest';
import QueryBuilder from '../../Common/Query/QueryBuilder';
import ODataDate from '../../Common/Date/ODataDate';

/**
 * Fetch Request for retrieving a list of Confirmations for a given day
 */
export class ConfirmationsFetchRequest extends FetchRequest {


    /**
     * Initiate a fetch request based on a ConfirmationDate
     * @param {Context} context - calling context
     * @param {ODataDate} odataDate - ODataDate to retrieve Confirmations for
     */
    constructor(context, odataDate = new ODataDate()) {
        let queryBuilder = new QueryBuilder();
        let dateStr = odataDate.queryString(context, 'date');
        queryBuilder.addFilter(`PostingDate eq ${dateStr}`);

        super('Confirmations', queryBuilder.build());
    }

}
