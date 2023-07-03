import libCom from '../Common/Library/CommonLibrary';
import ODataDate from '../Common/Date/ODataDate';

export default function MalfunctionStartTime(context) {
 
    let breakdown = libCom.getControlProxy(context,'BreakdownStartSwitch').getValue();
    let start = null;

    if (breakdown) {
        let date = libCom.getControlProxy(context,'MalfunctionStartTimePicker').getValue();
        date.setSeconds(0);
        let odataDate = new ODataDate(date);
        start = odataDate.toDBTimeString(context);
    }
    
    return start;
}
