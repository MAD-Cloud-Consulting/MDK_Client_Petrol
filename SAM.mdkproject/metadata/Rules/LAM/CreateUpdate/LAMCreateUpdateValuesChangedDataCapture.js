
import libCom from '../../Common/Library/CommonLibrary';
import libLocal from '../../Common/Library/LocalizationLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import Logger from '../../Log/Logger';

export default function LAMCreateUpdateValuesChangedDataCapture(context) {

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
   


    let lrpId = libCom.getControlProxy(pageProxy, 'LRPLstPkr' + controlSuffix).getValue();
    let startMarkerValue = libCom.getListPickerValue(libCom.getControlProxy(pageProxy, 'StartMarkerLstPkr' + controlSuffix).getValue());
    let endMarkerValue = libCom.getListPickerValue(libCom.getControlProxy(pageProxy, 'EndMarkerLstPkr' + controlSuffix).getValue());

    if (!libVal.evalIsEmpty(startMarkerValue) && libLocal.isNumber(context, start)) {
        let startDistanceControl = libCom.getControlProxy(pageProxy, 'DistanceFromStart' + controlSuffix);
        var startDistance = 0;
        context.read('/SAPAssetManager/Services/AssetManager.service', 'LinearReferencePatternItems', [], `$filter=(LRPId eq '${lrpId}' and Marker eq '${startMarkerValue}' and StartPoint ne '')`).then(function(result) {
            if (result && result.length > 0) {
                let marker = result.getItem(0);
                let markerValue = libLocal.toNumber(context,marker.StartPoint);
                startDistance = libLocal.toNumber(context, start) - markerValue;
                startDistanceControl.setValue(context.formatNumber(startDistance)); 
            } else {
                startDistanceControl.setValue('');
            }
        });
    }

    if (!libVal.evalIsEmpty(endMarkerValue) && libLocal.isNumber(context, end)) {
        let endDistanceControl = libCom.getControlProxy(pageProxy, 'DistanceFromEnd' + controlSuffix);
        var endDistance = 0;
        context.read('/SAPAssetManager/Services/AssetManager.service', 'LinearReferencePatternItems', [], `$filter=(LRPId eq '${lrpId}' and Marker eq '${endMarkerValue}' and StartPoint ne '')`).then(function(result) {
            if (result && result.length > 0) {
                let marker = result.getItem(0);
                let markerValue = libLocal.toNumber(context, marker.StartPoint);
                endDistance = libLocal.toNumber(context, end) - markerValue;
                endDistanceControl.setValue(context.formatNumber(endDistance));  
            } else {
                endDistanceControl.setValue('');
            }
        });

    }
    context.getPageProxy().redraw();

}
