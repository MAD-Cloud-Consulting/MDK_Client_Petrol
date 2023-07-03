import libCom from '../Common/Library/CommonLibrary';
import StartValidation from './CreateUpdate/ValidationRules/StartValidation';
import EndValidation from './CreateUpdate/ValidationRules/EndValidation';
import LengthValidation from './CreateUpdate/ValidationRules/LengthValidation';

export default function LAMCreateUpdateChangedLength(context) {
    let pageProxy = context.getPageProxy(context);
    let controls = libCom.getControlDictionaryFromPage(pageProxy);
    let start = libCom.getFieldValue(pageProxy, 'StartPoint');
    let length_field = libCom.getFieldValue(pageProxy, 'Length');
    let end = libCom.getFieldValue(pageProxy, 'EndPoint');

    StartValidation(context,controls.StartPoint,start,length_field);
    EndValidation(context,controls.EndPoint,end,length_field);
    LengthValidation(context,controls.Length,length_field);
}
