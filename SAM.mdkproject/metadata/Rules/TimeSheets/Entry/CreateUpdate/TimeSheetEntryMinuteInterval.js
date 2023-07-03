import libVal from '../../../Common/Library/ValidationLibrary';
import libCom from '../../../Common/Library/CommonLibrary';
import TimeSheetsIsEnabled from '../../TimeSheetsIsEnabled';

export default function getMinuteInterval(context) {

    const validNumbers = [1,5,10,15,30];
    let minutes;

    if (TimeSheetsIsEnabled(context)) {
        minutes = libCom.getAppParam(context, 'TIMESHEET', 'CATSMinutesInterval');
    } else { //Confirmations enabled
        minutes = libCom.getAppParam(context, 'PMCONFIRMATION', 'LaborTimeMinutesInterval');
    }

    minutes = parseInt(Number(minutes));
    if (!libVal.evalIsNumeric(minutes) || (!validNumbers.includes(minutes))) {
        minutes = 15;
    }
    
    return minutes;
}
