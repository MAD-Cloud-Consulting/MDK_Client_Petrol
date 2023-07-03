import libCom from '../../Common/Library/CommonLibrary';
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

    StartValidation(context,startControl,start,length_field);
    EndValidation(context,endControl,end,length_field);
    LengthValidation(context,lengthControl,length_field);
   
}
