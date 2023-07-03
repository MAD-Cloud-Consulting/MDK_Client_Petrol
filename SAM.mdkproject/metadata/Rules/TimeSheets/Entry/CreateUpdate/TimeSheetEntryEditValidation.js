import {TimeSheetEventLibrary as libTSEvent} from '../../TimeSheetLibrary';
import Logger from '../../../Log/Logger';

export default function TimeSheetEntryEditValidation(pageClientAPI) {
   

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libTSEvent.TimeSheetEntryEditValidation(pageClientAPI).then(result => {
         /**Implementing our Logger class*/
        Logger.debug(pageClientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryTimeSheets.global').getValue(), 'Validated Time Sheet Entry Edit');
        return result;
    });


}
