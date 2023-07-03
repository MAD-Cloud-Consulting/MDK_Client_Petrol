import TimeCaptureTypeHelper from './TimeCaptureTypeHelper';
import {ConfirmationsFetchRequest} from '../../Confirmations/Fetch/ConfirmationsFetchRequest';
import {TimeSheetDetailsLibrary} from '../../TimeSheets/TimeSheetLibrary';
import FetchRequest from '../../Common/Query/FetchRequest';
import QueryBuilder from '../../Common/Query/QueryBuilder';
import isAndroid from '../../Common/IsAndroid';

export default function TimeCaptureSectionTodayIcons(context) {

    return TimeCaptureTypeHelper(context, ConfirmationIcons, TimeSheetIcons);
}

function TimeSheetIcons(context) {

    let date = TimeSheetDetailsLibrary.TimeSheetCreateUpdateDate(context, new Date());

    let queryBuilder = new QueryBuilder();
    queryBuilder.addFilter(`Date eq datetime'${date}'`);
    let fetchRequest = new FetchRequest('CatsTimesheets', queryBuilder.build());

    return fetchRequest.execute(context).then(results => {
        let icons = [];

        results.some(timesheet => {
            if (timesheet.hasOwnProperty('@sap.isLocal') && timesheet['@sap.isLocal']) {
                icons.push(isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
                return true;
            }
            return false;
        });
        return icons;
    });
}

function ConfirmationIcons(context) {

    // Fetch request for today confirmations
    let fetchRequest = new ConfirmationsFetchRequest(context);

    return fetchRequest.execute(context).then(result => {

        let icons = [];

        result.some(conf => {
            if (conf.hasOwnProperty('@sap.isLocal') && conf['@sap.isLocal']) {
                icons.push(isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
                return true;
            }
            return false;
        });
        return icons;
    });
}
