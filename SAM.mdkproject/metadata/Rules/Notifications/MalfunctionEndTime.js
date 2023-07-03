import libCom from '../Common/Library/CommonLibrary';
import ODataDate from '../Common/Date/ODataDate';

export default function MalfunctionEndTime(context) {

    let breakdown = libCom.getControlProxy(context,'BreakdownEndSwitch').getValue();
    let end = null;

    if (breakdown) {
        let date = libCom.getControlProxy(context,'MalfunctionEndTimePicker').getValue();
        date.setSeconds(0);
        let odataDate = new ODataDate(date);
        end = odataDate.toDBTimeString(context);
    }

    return end;
 
}
