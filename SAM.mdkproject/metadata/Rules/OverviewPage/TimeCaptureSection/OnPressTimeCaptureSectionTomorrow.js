import TimeCaptureTypeHelper from './TimeCaptureTypeHelper';
import TimeSheetsYesterdaysDetails from '../../TimeSheets/TimeSheetsYesterdaysDetails';
import ODataDate from '../../Common/Date/ODataDate';
import { ConfirmationOverviewFetchRequest } from '../../Confirmations/Fetch/ConfirmationOverviewFetchRequest';


export default function OnPressTimeCaptureSectionTomorrow(context) {
    return TimeCaptureTypeHelper(context, NavigateToTomorrowConfirmationOverview, TimeSheetsYesterdaysDetails);
}

function NavigateToTomorrowConfirmationOverview(context) {

    let date = new Date();
    // Make it yesterday
    date.setDate(date.getDate() - 1);
    let odataDate = new ODataDate(date);
    let fetchReq = new ConfirmationOverviewFetchRequest(context, odataDate);
    return fetchReq.execute(context).then(results => {
        let confirmationOverview;
        if (results.length === 0) {
            // Build a fake overview
            confirmationOverview = {
                'PostingDate': odataDate.toLocalDateString(context),
            };
        } else {
            confirmationOverview = results.getItem(0);
        }

        return executeConfNavAction(context, confirmationOverview);
    });
}

function executeConfNavAction(context, overviewEntity) {
    let pageProxy = context.getPageProxy();
    pageProxy.setActionBinding(overviewEntity);
    return pageProxy.executeAction('/SAPAssetManager/Actions/Confirmations/ConfirmationsListViewNav.action');
}
