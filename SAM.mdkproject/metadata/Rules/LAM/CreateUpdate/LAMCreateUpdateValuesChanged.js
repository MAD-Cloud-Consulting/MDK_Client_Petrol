
import libCom from '../../Common/Library/CommonLibrary';
import libLocal from '../../Common/Library/LocalizationLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import StartValidation from './ValidationRules/StartValidation';
import EndValidation from './ValidationRules/EndValidation';
import LengthValidation from './ValidationRules/LengthValidation';

export default function LAMCreateUpdateValuesChanged(context) {
    let pageProxy = context.getPageProxy(context);
    let controls = libCom.getControlDictionaryFromPage(pageProxy);
    let start = libCom.getFieldValue(pageProxy, 'StartPoint');
    let end = libCom.getFieldValue(pageProxy, 'EndPoint');
    let length_field = libCom.getFieldValue(pageProxy, 'Length');

    let lrpId = libCom.getListPickerValue(libCom.getFieldValue(pageProxy, 'LRPLstPkr', '', null, true));
    let startMarkerValue = libCom.getListPickerValue(libCom.getFieldValue(pageProxy, 'StartMarkerLstPkr', '', null, true));
    let endMarkerValue = libCom.getListPickerValue(libCom.getFieldValue(pageProxy, 'EndMarkerLstPkr', '', null, true));

    if (!libVal.evalIsEmpty(startMarkerValue) && libLocal.isNumber(context, start)) {
        var startDistance = 0;
        context.read('/SAPAssetManager/Services/AssetManager.service', 'LinearReferencePatternItems', [], `$filter=(LRPId eq '${lrpId}' and Marker eq '${startMarkerValue}' and StartPoint ne '')`).then(function(result) {
            if (result && result.length > 0) {
                let marker = result.getItem(0);
                let markerValue = libLocal.toNumber(context,marker.StartPoint);
                startDistance = libLocal.toNumber(context, start) - markerValue;
                controls.DistanceFromStart.setValue(context.formatNumber(startDistance)); 
            } else {
                controls.DistanceFromStart.setValue('');
            }
        });
    }

    if (!libVal.evalIsEmpty(endMarkerValue) && libLocal.isNumber(context, end)) {
        var endDistance = 0;
        context.read('/SAPAssetManager/Services/AssetManager.service', 'LinearReferencePatternItems', [], `$filter=(LRPId eq '${lrpId}' and Marker eq '${endMarkerValue}' and StartPoint ne '')`).then(function(result) {
            if (result && result.length > 0) {
                let marker = result.getItem(0);
                let markerValue = libLocal.toNumber(context, marker.StartPoint);
                endDistance = libLocal.toNumber(context, end) - markerValue;
                controls.DistanceFromEnd.setValue(context.formatNumber(endDistance));  
            } else {
                controls.DistanceFromEnd.setValue('');
            }
        });

    }

    StartValidation(context,controls.StartPoint,start, startMarkerValue);
    EndValidation(context,controls.EndPoint,end,startMarkerValue);
    LengthValidation(context,controls.Length,length_field);
    StartValidation(context,controls.StartPoint,start, endMarkerValue);
    EndValidation(context,controls.EndPoint,end,endMarkerValue);

}
