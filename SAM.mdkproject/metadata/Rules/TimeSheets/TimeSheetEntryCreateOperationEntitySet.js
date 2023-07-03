import libForm from '../Common/Library/FormatLibrary';
import libCommon from '../Common/Library/CommonLibrary';

export default function TimeSheetEntryCreateOperationEntitySet(context) {
    let binding = libCommon.getBindingObject(context);
    let odataType = binding['@odata.type'];
    let returnValue = [];
    if (odataType === '#sap_mobile.MyWorkOrderOperation') {
        returnValue.push({DisplayValue: libForm.formatListPickerDisplayValue(context,binding.OperationNo,binding.OperationShortText), ReturnValue: binding['@odata.readLink']});
        return returnValue;
    } else if (odataType === '#sap_mobile.MyWorkOrderHeader') {
        return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'] + '/Operations', [], '$orderby=OperationNo asc').then(function(result) {
            if (result && result.length > 0) {
                result.forEach(function(value) {
                        returnValue.push({DisplayValue: libForm.formatListPickerDisplayValue(context,value.OperationNo,value.OperationShortText), ReturnValue: value['@odata.readLink']});
                });
                return returnValue;
            } else {
                return [];
            }
        });
    } else if (odataType === '#sap_mobile.MyWorkOrderSubOperation') {
        returnValue.push({DisplayValue: libForm.formatListPickerDisplayValue(context,binding.WorkOrderOperation.OperationNo,binding.WorkOrderOperation.OperationShortText), ReturnValue: binding.WorkOrderOperation['@odata.readLink']});
        return returnValue;
    } else {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderOperation', [], '$orderby=OperationNo asc').then(function(result) {
            if (result && result.length > 0) {
                result.forEach(function(value) {
                        returnValue.push({DisplayValue: libForm.formatListPickerDisplayValue(context,value.OperationNo,value.OperationShortText), ReturnValue: value['@odata.readLink']});
                });
                return returnValue;
            } else {
                return [];
            }
        });
    }

}
