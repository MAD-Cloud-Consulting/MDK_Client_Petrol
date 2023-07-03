import libCom from '../../../Common/Library/CommonLibrary';

export default function SerialNumbersTarget(context) {

    /*
    let date = new Date();
    let newDate;

    addRow(456, date);
    addRow(123456, new Date().setDate(date.getDate() + 3));
    addRow(789, new Date().setDate(date.getDate() + 2));
    newDate = new Date();
    newDate.setDate(date.getDate() + 1);
    newDate.setTime(date.getTime());
    addRow(123, newDate);
    addRow(111, newDate);
    addRow(987, newDate);
    */

    let serialMap = libCom.getStateVariable(context, 'NewSerialMap');
    let serialArray = Array.from(serialMap.values());

    // sort by value
    serialArray.sort(function(a, b) { //Sort by newest, then by serial number (For those already in the entity)
        if (a.Date === b.Date) {
           return a.SerialNumber - b.SerialNumber;
        } else {
            return b.Date - a.Date;
        }
    });

    return serialArray;
}
