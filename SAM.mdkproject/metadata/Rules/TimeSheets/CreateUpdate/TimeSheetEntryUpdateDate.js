import libCom from '../../Common/Library/CommonLibrary'; 
import ODataDate from '../../Common/Date/ODataDate';

export default function TimeSheetEntryUpdateDate(clientAPI) {
    let entryDate = libCom.getFieldValue(clientAPI, 'DatePicker');
    let odataDate = new ODataDate(entryDate);
    return odataDate.toDBDateString(clientAPI);
}
