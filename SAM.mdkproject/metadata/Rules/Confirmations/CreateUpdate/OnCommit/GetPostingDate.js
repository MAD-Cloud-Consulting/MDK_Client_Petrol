import ODataDate from '../../../Common/Date/ODataDate';
import getPostingOverride from '../../ConfirmationsGetPostingDateOverride';
import libCom from '../../../Common/Library/CommonLibrary';
import GetStartDateTime from './GetStartDateTime';

export default function GetPostingDate(context) {
    if (getPostingOverride(context)) { //User override from posting date screen field       
        let date = new ODataDate(libCom.getControlProxy(context, 'PostingDatePicker').getValue());
        return date.toLocalDateString();
    }
    //Backend will override, so send default start date in UTC
    let date = new Date(GetStartDateTime(context));
    let odataDate = new ODataDate(date);
    return odataDate.toDBDateString(context);
}
