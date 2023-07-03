import {TimeSheetDetailsLibrary as libTSDetails} from '../TimeSheetLibrary';
import {TimeSheetLibrary as libTS} from '../TimeSheetLibrary';

export default function TimeSheetEntryEntriesListViewSubstatusTextStyle(sectionProxy) {
    var section = sectionProxy.getName();
    if (section === 'TimesheetHeaders') {
        var property = sectionProxy.getProperty();     
        let completeHours = libTS.getTimesheetCompletionHours(sectionProxy);

        switch (property) {
            case 'SubheadStyle':
                {
                    return libTSDetails.TimeSheetEntryDetailsTotalHours(sectionProxy).then(function(totalHours) {
                        if (totalHours >= completeHours) {
                            return 'FootnotePrimary';
                        } else {
                            return 'ResetRed';
                        }
                    });
                }
            default:
                return sectionProxy.localizeText('unknown');
        }
    }
}
