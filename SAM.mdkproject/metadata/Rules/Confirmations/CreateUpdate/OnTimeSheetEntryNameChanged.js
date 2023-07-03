import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function OnTimeSheetEntryNameChanged(context) {
    let pageProxy = context.getPageProxy();

    let nameLstPicker = libCom.getControlProxy(pageProxy, 'MemberLstPkr');
     /* Clear the validation if the field is not empty */
    if (!libVal.evalIsEmpty(nameLstPicker.getValue())) {
        nameLstPicker.clearValidationOnValueChange();
    }
}
