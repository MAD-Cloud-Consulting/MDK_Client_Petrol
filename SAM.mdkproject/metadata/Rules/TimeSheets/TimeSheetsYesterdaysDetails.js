import TimeSheetData from './TimeSheetsData';
import Logger from '../Log/Logger';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';
export default function TimeSheetsYesterdaysDetails(context) {
    let date = new Date();
    date.setDate(date.getDate() - 1);
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Crew.global').getValue())) {
        context.getPageProxy().setActionBinding({
            'Date': date,
        });
        return context.executeAction('/SAPAssetManager/Actions/Crew/TimeSheets/TimeSheetDetailsNav.action');
    }
  
    return TimeSheetData(context, date).then((data) => {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'CatsTimesheetOverviewRows', [], "$filter=Date eq datetime'" + data.Date + "'").then(function(results) {
            if (results && results.getItem(0)) {
                context.getPageProxy().setActionBinding(results.getItem(0));
                return context.executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetEntryDetailsNav.action');
            } else {
                return Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryTimeSheets.global').getValue(), 'Record for Date ' + data.Date + ' not found in CatsTimesheetOverviewRows');
            }
        });
    }).catch(() => {
        context.getPageProxy().setActionBinding({
            'Date': date,
        });
        return context.executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetEntryDetailsNav.action');
    });

}
