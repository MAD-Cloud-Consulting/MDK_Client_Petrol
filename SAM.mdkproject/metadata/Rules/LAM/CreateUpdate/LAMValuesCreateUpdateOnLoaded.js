import libCom from '../../Common/Library/CommonLibrary';
import libLocal from '../../Common/Library/LocalizationLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import Stylizer from '../../Common/Style/Stylizer';

export default function LAMValuesCreateUpdateOnLoaded(context) {
    let onCreate = libCom.IsOnCreate(context);
    let controls = libCom.getControlDictionaryFromPage(context);
    let disableMarker = false;
    let lrpValue = '';
    let LRPLstPkr = Object.keys(controls).find(control => control.includes('LRPLstPkr'));
    let StartPoint = Object.keys(controls).find(control => control.includes('StartPoint'));
    let EndPoint = Object.keys(controls).find(control => control.includes('EndPoint'));
    let Length = Object.keys(controls).find(control => control.includes('Length'));
    let UOMLstPkr = Object.keys(controls).find(control => control.includes('UOMLstPkr'));
    let MarkerUOMLstPkr =Object.keys(controls).find(control => control.includes('MarkerUOMLstPkr'));
    let Offset1TypeLstPkr = Object.keys(controls).find(control => control.includes('1TypeLstPkr'));
    let Offset1 = Object.keys(controls).find(control => control.includes('offset1'));
    let Offset1UOMLstPkr = Object.keys(controls).find(control => control.includes('Offset1UOMLstPkr'));
    let Offset2TypeLstPkr = Object.keys(controls).find(control => control.includes('2TypeLstPkr'));
    let Offset2 = Object.keys(controls).find(control => control.includes('offset2'));
    let Offset2UOMLstPkr = Object.keys(controls).find(control => control.includes('Offset2UOMLstPkr'));
    let DistanceFromEnd = Object.keys(controls).find(control => control.includes('DistanceFromEnd'));
    let DistanceFromStart = Object.keys(controls).find(control => control.includes('DistanceFromStart'));
    let StartMarkerLstPkr = Object.keys(controls).find(control => control.includes('StartMarkerLstPkr'));
    let EndMarkerLstPkr =Object.keys(controls).find(control => control.includes('EndMarkerLstPkr'));
    let lamObj = libCom.getStateVariable(context, 'LAMDefaultRow');  
    if (onCreate) {

        if (!libVal.evalIsEmpty(lamObj)) {
            if (lamObj.LRPId) {
                if (libCom.isDefined(LRPLstPkr)) {
                    controls[LRPLstPkr].setValue(lamObj.LRPId);
                }
                lrpValue = lamObj.LRPId;
            } else {
                controls[LRPLstPkr].setValue('');
                disableMarker = true;
            }
            controls[StartPoint].setValue(String(libLocal.toNumber(context, lamObj.StartPoint,'',false)));
            controls[EndPoint].setValue(String(libLocal.toNumber(context, lamObj.EndPoint,'',false)));
            controls[Length].setValue(String(libLocal.toNumber(context, lamObj.Length,'',false)));
            controls[UOMLstPkr].setValue(lamObj.UOM);
            controls[MarkerUOMLstPkr].setValue(lamObj.MarkerUOM);
            controls[Offset1TypeLstPkr].setValue(lamObj.Offset1Type);
            controls[Offset1].setValue(String(libLocal.toNumber(context, lamObj.Offset1Value,'',false)));
            controls[Offset1UOMLstPkr].setValue(lamObj.Offset1UOM);
            controls[Offset2TypeLstPkr].setValue(lamObj.Offset2Type);
            controls[Offset2].setValue(String(libLocal.toNumber(context, lamObj.Offset2Value,'',false)));
            controls[Offset2UOMLstPkr].setValue(lamObj.Offset2UOM);
            if (lamObj.EndMarkerDistance !== '')
                controls[DistanceFromEnd].setValue(String(libLocal.toNumber(context, lamObj.EndMarkerDistance,'',false)));
            if (lamObj.StartMarkerDistance !== '')
                controls[DistanceFromStart].setValue(String(libLocal.toNumber(context, lamObj.StartMarkerDistance,'',false)));
            if (lamObj.StartMarker)
                controls[StartMarkerLstPkr].setValue(lamObj.StartMarker);
            if (lamObj.EndMarker)
                controls[EndMarkerLstPkr].setValue(lamObj.EndMarker);
        }
    } else { //Edit
         lrpValue = libCom.getListPickerValue(controls[LRPLstPkr].getValue());
        if (!lrpValue) {
            disableMarker = true;
        }
        //Trim spaces from numeric fields
          controls[StartPoint].setValue(String(controls[StartPoint].getValue()).trim());
          controls[EndPoint].setValue(String(controls[EndPoint].getValue()).trim());
          controls[Length].setValue(String(controls[Length].getValue()).trim());
          controls[DistanceFromStart].setValue(String(controls[DistanceFromStart].getValue()).trim());
          controls[DistanceFromEnd].setValue(String(controls[DistanceFromEnd].getValue()).trim());
          controls[Offset1].setValue(String(controls[Offset1].getValue()).trim());
          controls[Offset2].setValue(String(controls[Offset2].getValue()).trim());
    }
    if  (!libCom.isOnChangeset(context)) {
        libCom.saveInitialValues(context);
    }
    if (disableMarker) { //Disable marker fields if no LRP
        controls[StartMarkerLstPkr].setEditable(false);
        controls[DistanceFromStart].setEditable(false);
        controls[EndMarkerLstPkr].setEditable(false);
        controls[DistanceFromEnd].setEditable(false);
        controls[MarkerUOMLstPkr].setEditable(false);
        let stylizer = new Stylizer(['GrayText']);
        stylizer.apply(controls[StartMarkerLstPkr] , 'Value');
        stylizer.apply(controls[DistanceFromStart] , 'Value');
        stylizer.apply(controls[EndMarkerLstPkr] , 'Value');
        stylizer.apply(controls[DistanceFromEnd] , 'Value');
        stylizer.apply(controls[MarkerUOMLstPkr] , 'Value');
    } else { // Markers enabled, set list dropdown filter
        let startMarkerLstPkr = libCom.getControlProxy(context.getPageProxy(), 'StartMarkerLstPkr');
        let endMarkerLstPkr = libCom.getControlProxy(context.getPageProxy(), 'EndMarkerLstPkr');
        let specifier = startMarkerLstPkr.getTargetSpecifier();
        specifier.setEntitySet('LinearReferencePatternItems');
        specifier.setQueryOptions(`$filter=(LRPId eq '${lrpValue}' and StartPoint ne '')&$orderby=Marker`);
        specifier.setService('/SAPAssetManager/Services/AssetManager.service');
        return startMarkerLstPkr.setTargetSpecifier(specifier).then(() => {
            if (!libVal.evalIsEmpty(context.binding.StartMarker)) {
                startMarkerLstPkr.setValue(context.binding.StartMarker);
            } else {
                if (!libVal.evalIsEmpty(lamObj.StartMarker)) {
                    startMarkerLstPkr.setValue(lamObj.StartMarker);
                }
            }      
            return endMarkerLstPkr.setTargetSpecifier(specifier).then(() => {
                if (!libVal.evalIsEmpty(context.binding.EndMarker)) {
                    endMarkerLstPkr.setValue(context.binding.EndMarker);
                } else {
                    if (!libVal.evalIsEmpty(lamObj.StartMarker)) {
                        endMarkerLstPkr.setValue(lamObj.EndMarker);
                    }
                }    
                return Promise.resolve(true);
            });
        });
    }
    return Promise.resolve(true);
}
