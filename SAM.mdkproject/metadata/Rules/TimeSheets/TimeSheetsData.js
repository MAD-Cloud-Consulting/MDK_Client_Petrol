import {TimeSheetLibrary as libTS} from '../TimeSheets/TimeSheetLibrary';
import Logger from '../Log/Logger';

export default function TimeSheetsData(context, date) {
    let entitySet = libTS.getEntitySetWithBackendFormat(context, date);
    return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], '').then(results => {
        if (results.length > 0) {
            return results.getItem(0);
        } else {
            return '';
        }
    }).catch(() => {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryTimeSheets.global').getValue() , 'Cannot find any record for this date');
    });
}
