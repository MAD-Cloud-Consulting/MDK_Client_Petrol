import libCom from '../Common/Library/CommonLibrary';
import ODataDate from '../Common/Date/ODataDate';

export default function MalfunctionStartDate(context) {
 
    let breakdown = libCom.getControlProxy(context,'BreakdownStartSwitch').getValue();
    let start = null;

    if (breakdown) {
        let startDate = libCom.getControlProxy(context, 'MalfunctionStartDatePicker').getValue();
        let startTime = libCom.getControlProxy(context,'MalfunctionStartTimePicker').getValue();

        startTime.setFullYear(startDate.getFullYear());
        startTime.setMonth(startDate.getMonth());
        startTime.setDate(startDate.getDate());
        let date = new Date(startTime);
        let odataDate = new ODataDate(date);
        start = odataDate.toDBDateString(context);
    }
    
    return start;
}
