import libCommon from '../../Library/CommonLibrary';

export default function ReferenceItemsValueChanged(control) {
    libCommon.setStateVariable(control.getPageProxy(), 'CopyValues', control.getValue());
    let pageProxy = control.getPageProxy();
   
    let copyNoteSelected = !!control.getValue().find(oValue => oValue.ReturnValue === 'NOTE_TO_COPY');
    let longTextControlIsEditable = !!libCommon.getControlProxy(pageProxy, 'LongTextNote').getEditable();
    let copyInstallLocationSelected = !!control.getValue().find(oValue => oValue.ReturnValue === 'INSTALL_LOCATION_TO_COPY');
    let superiorEquipmentControlIsEditable = libCommon.getControlProxy(pageProxy, 'EquipHierarchyExtensionControl').getEditable();
    let funcLocControlIsEditable = libCommon.getControlProxy(pageProxy, 'FuncLocHierarchyExtensionControl').getEditable();

    if (copyNoteSelected) {
        libCommon.getControlProxy(pageProxy, 'LongTextNote').setValue('');
        libCommon.getControlProxy(pageProxy, 'LongTextNote').setEditable(false);
    } else if (!copyNoteSelected && !longTextControlIsEditable) {
        libCommon.getControlProxy(pageProxy, 'LongTextNote').setEditable(true);
    }

    if (copyInstallLocationSelected) {
        control.getPageProxy().getControl('FormCellContainer').getControl('EquipHierarchyExtensionControl')._control.setValue('');   
        libCommon.getControlProxy(pageProxy, 'EquipHierarchyExtensionControl').setEditable(false);

        control.getPageProxy().getControl('FormCellContainer').getControl('FuncLocHierarchyExtensionControl')._control.setValue('');               
        libCommon.getControlProxy(pageProxy, 'FuncLocHierarchyExtensionControl').setEditable(false);
    } else if (!copyInstallLocationSelected && !superiorEquipmentControlIsEditable && !funcLocControlIsEditable) {
        libCommon.getControlProxy(pageProxy, 'EquipHierarchyExtensionControl').setEditable(true);

        libCommon.getControlProxy(pageProxy, 'FuncLocHierarchyExtensionControl').setEditable(true);
    }
}
