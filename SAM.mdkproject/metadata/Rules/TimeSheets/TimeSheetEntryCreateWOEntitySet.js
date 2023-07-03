import libForm from '../Common/Library/FormatLibrary';
import libCommon from '../Common/Library/CommonLibrary';

export default function TimeSheetEntryCreateWOEntitySet(context) {
    let binding = libCommon.getBindingObject(context);
    let odataType = binding['@odata.type'];
    if (odataType === '#sap_mobile.MyWorkOrderHeader') {
        return [{DisplayValue: libForm.formatListPickerDisplayValue(context,binding.OrderId,binding.OrderDescription), ReturnValue: binding['@odata.readLink']}];
    } else if (odataType === '#sap_mobile.MyWorkOrderOperation') {
        return [{DisplayValue: libForm.formatListPickerDisplayValue(context,binding.WOHeader.OrderId,binding.WOHeader.OrderDescription), ReturnValue: binding.WOHeader['@odata.readLink']}];
    } else if (odataType === '#sap_mobile.MyWorkOrderSubOperation') {
        return [{DisplayValue: libForm.formatListPickerDisplayValue(context,binding.WorkOrderOperation.WOHeader.OrderId,binding.WorkOrderOperation.WOHeader.OrderDescription), ReturnValue: binding.WorkOrderOperation.WOHeader['@odata.readLink']}];
    } else {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', [], '$orderby=OrderId asc').then(function(result) {
            if (result && result.length > 0) {
                let returnValue = [];
                result.forEach(function(value) {
                        returnValue.push({DisplayValue: libForm.formatListPickerDisplayValue(context,value.OrderId,value.OrderDescription), ReturnValue: value['@odata.readLink']});
                });
                return returnValue;
            } else {
                return [];
            }
        });
    }
}
