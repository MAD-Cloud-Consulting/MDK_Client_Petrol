import TimeCaptureTypeHelper from './TimeCaptureTypeHelper';
import TimeSheetTodayHoursForCrew from '../../Crew/TimeSheets/CrewTimeSheetsTodaysHours';
import TimeSheetTodayHours from '../../TimeSheets/TimeSheetsTodaysHours';
import ODataDate from '../../Common/Date/ODataDate';
import ConfirmationTotalDuration from '../../Confirmations/ConfirmationTotalDuration';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';
export default function TimeCaptureSectionTodayHours(context) {
    return TimeCaptureTypeHelper(context, ConfirmationTodayHours, TimeSheetsTodayHours);
}

export function ConfirmationTodayHours(context) {

    let odataDate = new ODataDate();
    let date = new Date(odataDate.toDBDateString());
    return ConfirmationTotalDuration(context, date).then(hours => {
        return context.localizeText('x_hours', [hours]);
    });
}
export function TimeSheetsTodayHours(context) {
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Crew.global').getValue())) {
        return TimeSheetTodayHoursForCrew(context).then(hours => {
            return context.localizeText('x_hours', [hours]);
        });
    } else {
        return TimeSheetTodayHours(context);
    }
    
}

