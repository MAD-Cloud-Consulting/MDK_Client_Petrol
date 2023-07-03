
import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import StartValidation from './ValidationRules/StartValidation';
import EndValidation from './ValidationRules/EndValidation';
import LengthValidation from './ValidationRules/LengthValidation';

export default function LAMUOMUpdate(context) {
    let pageProxy = context.getPageProxy(context);
    let controls = libCom.getControlDictionaryFromPage(pageProxy);
    let start = libCom.getFieldValue(pageProxy, 'StartPoint');
    let length_field = libCom.getFieldValue(pageProxy, 'Length');
    let end = libCom.getFieldValue(pageProxy, 'EndPoint');
    
    StartValidation(context,controls.StartPoint,start,libCom.isDefined(controls.UOMLstPkr.getValue()));
    EndValidation(context,controls.EndPoint,end,libCom.isDefined(controls.UOMLstPkr.getValue()));
    LengthValidation(context,controls.Length,length_field);
    let uomControl =  libCom.getControlProxy(pageProxy, 'UOMLstPkr');
    let uomMarkerControl = libCom.getControlProxy(pageProxy, 'MarkerUOMLstPkr');
    CheckListPickerValue(context,uomControl);
    if (libCom.isDefined(controls.UOMLstPkr.getValue())) {
        StartValidation(context,controls.StartPoint,start,libCom.isDefined(controls.MarkerUOMLstPkr.getValue()));
        EndValidation(context,controls.EndPoint,end,libCom.isDefined(controls.MarkerUOMLstPkr.getValue()));
        CheckListPickerValue(context,uomMarkerControl);  
    }   
}
function CheckListPickerValue(context,control) {
    if (libVal.evalIsEmpty(libCom.getListPickerValue(control.getValue()) )) {
        let message = context.localizeText('field_is_required');
        libCom.executeInlineControlError(context,control, message);   
    } else {
        control.clearValidation();
    }
}
