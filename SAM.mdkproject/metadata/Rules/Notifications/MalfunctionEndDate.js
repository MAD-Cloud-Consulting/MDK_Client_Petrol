import libCom from '../Common/Library/CommonLibrary';
import ODataDate from '../Common/Date/ODataDate';

export default function MalfunctionEndDate(context) {
 
    let breakdown = libCom.getControlProxy(context,'BreakdownEndSwitch').getValue();
    let end = null;

    if (breakdown) {
        let endDate = libCom.getControlProxy(context, 'MalfunctionEndDatePicker').getValue();
        let endTime = libCom.getControlProxy(context,'MalfunctionEndTimePicker').getValue();

        endTime.setFullYear(endDate.getFullYear());
        endTime.setMonth(endDate.getMonth());
        endTime.setDate(endDate.getDate());
        let date = new Date(endTime);
        let odataDate = new ODataDate(date);
        end = odataDate.toDBDateString(context);
    }

    return end;

}
