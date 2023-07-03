import libCom from '../../Common/Library/CommonLibrary';

export default function NotificationCreateUpdateHierarchyListPickerOnLoaded(control) {
    let name = control.getName();
    let context = control.getPageProxy();

    if (context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
        return setDefaultListPickerValue(context, name);
    } else {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', [], `$filter=OrderId eq '${context.binding.OperationOrderId}'`).then(result => {
            let workOrder = result.getItem(0);
            return setDefaultListPickerValue(context, name, workOrder);
        });
    }
}

function setDefaultListPickerValue(context, name, workOrder = {}) {
    let formCellContainer = context.getControl('FormCellContainer');
    var extension;
    var value;

    if (name === 'FuncLocHierarchyExtensionControl') {
        value = formCellContainer.getControl('FuncLocHierarchyExtensionControl').getValue();
        if (!value) {
            value = context.binding.HeaderFunctionLocation || workOrder.HeaderFunctionLocation;
        }
        if (value) {
            extension = formCellContainer.getControl('FuncLocHierarchyExtensionControl')._control._extension;
        }
    } else {
        value = formCellContainer.getControl('EquipHierarchyExtensionControl').getValue();
        if (!value) {
            value = context.binding.HeaderEquipment || workOrder.HeaderEquipment;
        }
        if (value) {
            extension = formCellContainer.getControl('EquipHierarchyExtensionControl')._control._extension;
        }
    }
    if (extension) {
        extension.setData(value);
        //resave initial values after default picker value was set
        libCom.saveInitialValues(context);
    }
}
