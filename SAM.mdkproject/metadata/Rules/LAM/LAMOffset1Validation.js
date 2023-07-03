
import libCom from '../Common/Library/CommonLibrary';
import StartValidation from './CreateUpdate/ValidationRules/StartValidation';
import EndValidation from './CreateUpdate/ValidationRules/EndValidation';
import LengthValidation from './CreateUpdate/ValidationRules/LengthValidation';
import OffsetsValidation from './CreateUpdate/ValidationRules/OffsetsValidation';
import Offset2TypeValidation from './CreateUpdate/ValidationRules/Offset2TypeValidation';

export default function LAMOffset1Validation(context) {
    let pageProxy = context.getPageProxy(context);
    let controls = libCom.getControlDictionaryFromPage(pageProxy);
    let start = libCom.getFieldValue(pageProxy, 'StartPoint');
    let end = libCom.getFieldValue(pageProxy, 'EndPoint');
    let length_field = libCom.getFieldValue(pageProxy, 'Length');
   
    StartValidation(context,controls.StartPoint,start,libCom.isDefined(controls.Offset1TypeLstPkr.getValue()));
    EndValidation(context,controls.EndPoint,end,libCom.isDefined(controls.Offset1TypeLstPkr.getValue()));
    LengthValidation(context,controls.Length,length_field);
    
    if (libCom.getListPickerValue(controls.Offset1TypeLstPkr.getValue())&&libCom.getListPickerValue(controls.Offset2TypeLstPkr.getValue())) {
            OffsetsValidation(context,controls.Offset1TypeLstPkr,controls.Offset2TypeLstPkr);
    } 
    if (libCom.getListPickerValue(controls.Offset1TypeLstPkr.getValue())&&!libCom.getListPickerValue(controls.Offset2TypeLstPkr.getValue())) {
        controls.Offset1TypeLstPkr.clearValidation();
    }
    if (libCom.getListPickerValue(controls.Offset2TypeLstPkr.getValue())&&!libCom.getListPickerValue(controls.Offset1TypeLstPkr.getValue())) {
        controls.Offset2TypeLstPkr.clearValidation();
    }

    Offset2TypeValidation(context,controls.Offset1TypeLstPkr,libCom.getFieldValue(pageProxy, 'offset1', '', null, true),
        libCom.isDefined(libCom.getListPickerValue(libCom.getFieldValue(pageProxy, 'Offset1TypeLstPkr', '', null, true))));
    Offset2TypeValidation(context,controls.Offset2TypeLstPkr,libCom.getFieldValue(pageProxy, 'offset2', '', null, true),
        libCom.isDefined(libCom.getListPickerValue(libCom.getFieldValue(pageProxy, 'Offset2TypeLstPkr', '', null, true))));
     
}

