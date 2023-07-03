import ODataDate from '../../Common/Date/ODataDate';
import libCom from '../../Common/Library/CommonLibrary';

export default function CrewTimeSheetsTodaysDate(context) {
    let datetime;
    if (context.binding.Date instanceof Date) {  //when coming from overview, we have a javascript date object
        datetime = context.binding.Date;
    } else { //when coming from crew summary, we have a bound date property from the CatsTimesheetOverviewRows entity set
        datetime = context.binding.Date.substr(0, 10);
    }
    let odataDate = new ODataDate(datetime).date();

    return libCom.relativeDayOfWeek(odataDate, context)  + ', ' + context.formatDate(odataDate);
}
