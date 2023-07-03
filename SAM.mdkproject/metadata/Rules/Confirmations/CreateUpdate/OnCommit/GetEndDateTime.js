import GetStartDateTime from './GetStartDateTime';
import libCom from '../../../Common/Library/CommonLibrary';

export default function GetEndDateTime(context) {
    let startDate = GetStartDateTime(context);
    let duration = libCom.getControlProxy(context, 'DurationPkr').getValue();
    let endDate = new Date(startDate);
    endDate.setMinutes(startDate.getMinutes() + duration);
    endDate.setSeconds(0);
    return endDate;
}
