import {TimeSheetDetailsLibrary as libTSDetails} from '../../TimeSheetLibrary';
import ConvertDoubleToHourString from '../../../Confirmations/ConvertDoubleToHourString';

export default function TimeSheetEntryDetailsTotalHoursLabel(pageClientAPI) {
    return libTSDetails.TimeSheetEntryDetailsTotalHours(pageClientAPI).then(function(hours) {
        return pageClientAPI.localizeText('x_hours', [ConvertDoubleToHourString(hours)]);
    }); 
}
