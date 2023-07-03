import { TimeSheetLibrary as libTimesheet } from '../../TimeSheets/TimeSheetLibrary';
import {ValueIfExists} from '../../Common/Library/Formatter';
import ConvertDoubleToHourString from '../../Confirmations/ConvertDoubleToHourString';

export default function CrewTimesheetNonWorkingHours(context) {
    let catTimeSheets = context.binding.Employee.CatsTimesheet;
    let hoursCount;
    return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/CrewList', [], '').then(function(result) {
        catTimeSheets.forEach(function(element) {
            if (libTimesheet.isNonWorking(context, element.AttendAbsenceType) && element.Date === result.getItem(0).OriginTimeStamp) {
                if (!hoursCount) {
                    hoursCount = 0;   
                }
                hoursCount += libTimesheet.getActualHours(context, element.Hours);
            }
        });
        if (hoursCount) {
            return ConvertDoubleToHourString(hoursCount);   
        } else {
            return ValueIfExists(hoursCount);
        }
    });
    
}
