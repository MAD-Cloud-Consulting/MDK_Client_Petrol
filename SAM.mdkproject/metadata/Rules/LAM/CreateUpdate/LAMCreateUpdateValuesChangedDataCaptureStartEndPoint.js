import libCom from '../../Common/Library/CommonLibrary';
import libLocal from '../../Common/Library/LocalizationLibrary';
import Logger from '../../Log/Logger';
import StartValidation from './ValidationRules/StartValidation';

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
    let length = 0;


    if (libLocal.isNumber(context, start) && libLocal.isNumber(context, end)) {
        length = Math.abs(libLocal.toNumber(context, end) - libLocal.toNumber(context, start));
        lengthControl.setValue(context.formatNumber(length, '',{useGrouping : false}));

    }
    if (start) {
        context.clearValidation();
    }
    
    StartValidation(context,startControl,start,end);
  
    if (end) {
        context.clearValidation();
    }
}
