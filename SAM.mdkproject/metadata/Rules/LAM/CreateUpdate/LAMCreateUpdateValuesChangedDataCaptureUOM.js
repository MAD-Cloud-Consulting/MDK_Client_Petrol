import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import Logger from '../../Log/Logger';
import StartValidation from './ValidationRules/StartValidation';
import EndValidation from './ValidationRules/EndValidation';
import LengthValidation from './ValidationRules/LengthValidation';

export default function LAMCreateUpdateValuesChangedDataCaptureEndPoint(context) {

    let nameSplit = context.getName().split('_');
    if (nameSplit.length < 3) {
        Logger.error('Provided control does not appear to be from a Field Data Capture container');
        return;
    }
    let controlSuffix = '_' + nameSplit[nameSplit.length - 2] + '_' + nameSplit[nameSplit.length - 1];

    let pageProxy = context.getPageProxy();
    
    let startControl = libCom.getControlProxy(pageProxy, 'StartPoint' + controlSuffix);
    let start = startControl.getValue();
    let endControl = libCom.getControlProxy(pageProxy, 'EndPoint' + controlSuffix);
    let end = endControl.getValue();
    let lengthControl = libCom.getControlProxy(pageProxy, 'Length' + controlSuffix);
    let length_field = lengthControl.getValue();
    let uomControl =  libCom.getControlProxy(pageProxy, 'UOMLstPkr' + controlSuffix);
    let uomMarkerControl = libCom.getControlProxy(pageProxy, 'MarkerUOMLstPkr' + controlSuffix);

    StartValidation(context,startControl,start,uomControl.getValue());
    EndValidation(context,endControl,end,uomControl.getValue());
    StartValidation(context,startControl,start,uomMarkerControl.getValue());
    EndValidation(context,endControl,end,uomMarkerControl.getValue());
    LengthValidation(context,lengthControl,length_field);
    CheckListPickerValue(context,uomControl);
    CheckListPickerValue(context,uomMarkerControl);  
}
function CheckListPickerValue(context,control) {
    if (libVal.evalIsEmpty(libCom.getListPickerValue(control.getValue()) )) {
        let message = context.localizeText('field_is_required');
        libCom.executeInlineControlError(context,control, message);   
    } 
}
