import {TimeSheetEventLibrary as libTSEvent} from '../../TimeSheetLibrary';
import Logger from '../../../Log/Logger';

export default function TimeSheetEntryCreateUpdateValidation(pageClientAPI) {
   

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libTSEvent.TimeSheetEntryCreateUpdateValidation(pageClientAPI).then(result => {
         /**Implementing our Logger class*/
        Logger.debug(pageClientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryTimeSheets.global').getValue(), 'Validated Time Sheet Entry Creation');
        return result;
    });


}
