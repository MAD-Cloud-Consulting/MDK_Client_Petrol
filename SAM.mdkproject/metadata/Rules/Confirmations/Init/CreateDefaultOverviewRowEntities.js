import FetchRequest from '../../Common/Query/FetchRequest';
import ConfirmationsIsEnabled from '../ConfirmationsIsEnabled';
import ODataDate from '../../Common/Date/ODataDate';

/**
 * Initialize the overview entities over the 
 * @param {*} context 
 */
export default function CreateDefaultOverviewRowEntities(context) {

    if (!ConfirmationsIsEnabled(context)) {
        // Exit early
        return Promise.resolve(true);
    }

    let date = new Date();
    // Add offset to next Sunday
    let offset = 7 - date.getDay();
    date.setDate(date.getDate() + offset);

    return createOverviewRowIfMissing(context, date, 0);
}

function createOverviewRowIfMissing(context, date, iteration) {
    if (iteration >= 14) {
        // Max iteration
        return Promise.resolve(true);
    }
    let odataDate = new ODataDate(date);

    return new FetchRequest('ConfirmationOverviewRows').get(context, odataDate.queryString(context, 'date')).then(() => {
        // Already exists, ignore
        return iterate(context, date, iteration);
    }).catch(() => {
        // Expected, this entity is missing
        return createMissingOverviewRow(context, odataDate).then(() => {
            return iterate(context, date, iteration);
        });
    });
}

function iterate(context, date, iteration) {
    date.setDate(date.getDate() - 1);
    return createOverviewRowIfMissing(context, date, iteration + 1);
}

/**
 * Create a ConfirmationOverviewRow for an odata date
 * @param {Context} context 
 * @param {ODataDate} odataDate 
 */
function createMissingOverviewRow(context, odataDate) {
    context.getClientData().ConfirmationOverviewRowDate = odataDate.toLocalDateString(context);
    return context.executeAction('/SAPAssetManager/Actions/Confirmations/DefaultConfirmationOverviewRowCreate.action');
}
