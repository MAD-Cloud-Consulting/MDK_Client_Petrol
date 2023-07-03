import queryOptions from './WorkOrderConfirmationsQueryOptions';
import FetchRequest from '../../Common/Query/FetchRequest';

export default function ConfirmationsCountTitle(context) {
    // Get the query options
    let queryString = queryOptions(context);
    let request = new FetchRequest('Confirmations', queryString);

    return request.count(context).then(countResult => {
        return context.localizeText('confirmations_count', [countResult]);
    });
}
