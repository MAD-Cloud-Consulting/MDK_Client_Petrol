import CommonLibrary from '../../../Common/Library/CommonLibrary';

/**
* Disables SuperiorEquipment or Functional Location picker if another is selected
* @param {IClientAPI} clientAPI
*/
export default function HierarchyListPickerValueChanged(clientAPI) {
    let pageProxy = clientAPI.getPageProxy();
    let equipmentHierarchyListPickerControl = CommonLibrary.getControlProxy(pageProxy, 'EquipHierarchyExtensionControl');
    let funcLocHierarchyListPickerControl = CommonLibrary.getControlProxy(pageProxy, 'FuncLocHierarchyExtensionControl');
    let equipmentHierarchyListPickerSelected = !!CommonLibrary.getControlValue(equipmentHierarchyListPickerControl);
    let funcLocHierarchyListPickerSelected = !!CommonLibrary.getControlValue(funcLocHierarchyListPickerControl);

    if (equipmentHierarchyListPickerSelected) {
        funcLocHierarchyListPickerControl.setEditable(false);
    } else if (funcLocHierarchyListPickerSelected) {
        equipmentHierarchyListPickerControl.setEditable(false);
    } else {
        funcLocHierarchyListPickerControl.setEditable(true);
        equipmentHierarchyListPickerControl.setEditable(true);
    }
}
