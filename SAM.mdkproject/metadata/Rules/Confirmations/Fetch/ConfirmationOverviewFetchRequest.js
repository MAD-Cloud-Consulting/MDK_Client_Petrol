import FetchRequest from '../../Common/Query/FetchRequest';
import QueryBuilder from '../../Common/Query/QueryBuilder';
// import { ConfirmationDate } from '../ConfirmationDate';


/**
 * Fetch Request for retrieving a Confirmation Overview based on a date
 */
export class ConfirmationOverviewFetchRequest extends FetchRequest {


    /**
     * Initiate a fetch request based on a ConfirmationDate
     * @param {Context} context - callingContext
     * @param {ODataDate} odataDate - date to retrieve confirmations for
     */
    constructor(context, odataDate) {
        let queryBuilder = new QueryBuilder();
        let dateQueryStr = odataDate.queryString(context, 'date');
        queryBuilder.addFilter(`PostingDate eq ${dateQueryStr}`);
        queryBuilder.addExtra('top=1');

        super('ConfirmationOverviewRows', queryBuilder.build());
    }

}
