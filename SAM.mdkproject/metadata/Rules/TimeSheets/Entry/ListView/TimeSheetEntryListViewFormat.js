import {TimeSheetLibrary as libTS, TimeSheetDetailsLibrary as libTSDetails} from '../../TimeSheetLibrary';
import libCom from '../../../Common/Library/CommonLibrary';
import ODataDate from '../../../Common/Date/ODataDate';

export default function TimeSheetEntryListViewFormat(sectionProxy) {
    let section = sectionProxy.getName();
    if (section === 'TimesheetHeaders') {
        let property = sectionProxy.getProperty();
        let datetime = sectionProxy.binding.Date.substr(0, 10);
    
        let odataDate = new ODataDate(datetime);

        // These values are initialized here for ESLint
        let hours = libCom.toTwoPlaces(sectionProxy,sectionProxy.binding.Hours);
        let completeHours = libTS.getTimesheetCompletionHours(sectionProxy);

        switch (property) {
            case 'Title':
                return libCom.relativeDayOfWeek(odataDate.date(), sectionProxy) + ', ' + sectionProxy.formatDate(odataDate.date());
            case 'Subhead':
                return hours + ' ' + sectionProxy.localizeText('hours_suffix');
            case 'SubstatusText':
                {
                    return libTSDetails.TimeSheetEntryDetailsTotalHours(sectionProxy).then(function(totalHours) {
                        if (totalHours >= completeHours) {
                            return sectionProxy.localizeText('complete');
                        } else {
                            return sectionProxy.localizeText('incomplete');
                        }
                    });
                }
            default:
                return sectionProxy.localizeText('unknown');
        }
    }
}
