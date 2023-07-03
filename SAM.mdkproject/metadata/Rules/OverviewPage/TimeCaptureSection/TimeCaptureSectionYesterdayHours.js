import TimeCaptureTypeHelper from './TimeCaptureTypeHelper';
import TimeSheetYesterdayHoursForCrew from '../../Crew/TimeSheets/CrewTimeSheetsPreviousDayHours';
import TimeSheetYesterdayHours from '../../TimeSheets/TimeSheetsYesterdaysHours';
import ConfirmationTotalDuration from '../../Confirmations/ConfirmationTotalDuration';
import ODataDate from '../../Common/Date/ODataDate';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';

export default function TimeCaptureSectionYesterdayHours(context) {

    return TimeCaptureTypeHelper(context, ConfirmationYesterdayHours, TimeSheetsYesterdayHours);
}

function ConfirmationYesterdayHours(context) {

    let odataDate = new ODataDate();
    let date = new Date(odataDate.toDBDateString());
    date.setDate(date.getDate() - 1);
    return ConfirmationTotalDuration(context, date).then(hours => {
        return context.localizeText('x_hours', [hours]);
    });
}
export function TimeSheetsYesterdayHours(context) {
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Crew.global').getValue())) {
        return TimeSheetYesterdayHoursForCrew(context).then(hours => {
            return context.localizeText('x_hours', [hours]);
        });
    } else {
        return TimeSheetYesterdayHours(context);
    }
}
