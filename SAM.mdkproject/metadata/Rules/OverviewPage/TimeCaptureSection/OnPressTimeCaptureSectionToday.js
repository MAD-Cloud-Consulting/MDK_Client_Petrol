import TimeCaptureTypeHelper from './TimeCaptureTypeHelper';
import TimeSheetsTodayDetails from '../../TimeSheets/TimeSheetsTodaysDetails';
import ODataDate from '../../Common/Date/ODataDate';
import { ConfirmationOverviewFetchRequest } from '../../Confirmations/Fetch/ConfirmationOverviewFetchRequest';

export default function OnPressTimeCaptureSectionToday(context) {

    return TimeCaptureTypeHelper(context, NavigateToTodayConfirmationOverview, TimeSheetsTodayDetails);

}

function NavigateToTodayConfirmationOverview(context) {

    let date = new ODataDate();
    let fetchReq = new ConfirmationOverviewFetchRequest(context, date);
    return fetchReq.execute(context).then(results => {
        let confirmationOverview;
        if (results.length === 0) {
            // Build a fake overview
            confirmationOverview = {
                'PostingDate': date.toLocalDateString(context),
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
