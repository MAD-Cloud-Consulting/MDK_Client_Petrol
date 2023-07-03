import libCom from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
import StartValidation from './ValidationRules/StartValidation';
import EndValidation from './ValidationRules/EndValidation';
import LengthValidation from './ValidationRules/LengthValidation';
import OffsetsValidation from './ValidationRules/OffsetsValidation';
import Offset2TypeValidation from './ValidationRules/Offset2TypeValidation';

export default function LAMDataCaptureOffset1Validation(context) {

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
    let offset1TypeControl = libCom.getControlProxy(pageProxy, 'Offset1TypeLstPkr' + controlSuffix);
    let offset2TypeControl = libCom.getControlProxy(pageProxy, 'Offset2TypeLstPkr' + controlSuffix);
    let offset_1_value = libCom.getControlProxy(pageProxy, 'offset1' + controlSuffix).getValue();
    let offset_2_value = libCom.getControlProxy(pageProxy, 'offset2' + controlSuffix).getValue();


    StartValidation(context,startControl,start,libCom.isDefined(offset1TypeControl.getValue()));
    EndValidation(context,endControl,end,libCom.isDefined(offset1TypeControl.getValue()));
    StartValidation(context,startControl,start,libCom.isDefined(offset2TypeControl.getValue()));
    EndValidation(context,endControl,end,libCom.isDefined(offset2TypeControl.getValue()));
    StartValidation(context,startControl,start,libCom.isDefined(offset_1_value));
    EndValidation(context,endControl,end,libCom.isDefined(offset_1_value));
    StartValidation(context,startControl,start,libCom.isDefined(offset_2_value));
    EndValidation(context,endControl,end,libCom.isDefined(offset_2_value));
    LengthValidation(context,lengthControl,lengthControl.getValue());
    if (libCom.getListPickerValue(offset1TypeControl.getValue())&&libCom.getListPickerValue(offset2TypeControl.getValue())) {
        OffsetsValidation(context,offset1TypeControl,offset2TypeControl);
    } 
    if (libCom.getListPickerValue(offset1TypeControl.getValue())&&!libCom.getListPickerValue(offset2TypeControl.getValue())) {
        offset1TypeControl.clearValidation();
    }
    if (libCom.getListPickerValue(offset2TypeControl.getValue())&&!libCom.getListPickerValue(offset1TypeControl.getValue())) {
        offset2TypeControl.clearValidation();
    }
    
    Offset2TypeValidation(context,offset1TypeControl,offset_1_value,libCom.getListPickerValue(offset1TypeControl.getValue()));
    Offset2TypeValidation(context,offset2TypeControl,offset_2_value,libCom.getListPickerValue(offset2TypeControl.getValue()));
}
