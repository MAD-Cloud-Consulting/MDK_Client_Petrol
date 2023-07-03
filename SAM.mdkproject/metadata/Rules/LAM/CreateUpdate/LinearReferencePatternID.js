
import libCom from '../../Common/Library/CommonLibrary';

export default function LinearReferencePatternID(context) {
    let pickerValue = libCom.getTargetPathValue(context, '#Control:LRPLstPkr/#Value');
    return libCom.getListPickerValue(pickerValue);

}
