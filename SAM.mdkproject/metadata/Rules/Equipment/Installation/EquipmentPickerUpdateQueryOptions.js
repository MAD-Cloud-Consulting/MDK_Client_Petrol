import libVal from '../../Common/Library/ValidationLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import hideCancel from '../../ErrorArchive/HideCancelForErrorArchiveFix';

export default function EquipmentPickerUpdateQueryOptions(context) {
    let pageProxy = context;

    if (typeof context.getPageProxy === 'function') {
        pageProxy = context.getPageProxy();
    }

    let equipmentCategory;
    if (pageProxy.evaluateTargetPath('#Control:EquipmentCategoryPicker').getValue() && pageProxy.evaluateTargetPath('#Control:EquipmentCategoryPicker').getValue().length > 0) {
        equipmentCategory = pageProxy.evaluateTargetPath('#Control:EquipmentCategoryPicker').getValue()[0].ReturnValue;
    }
    let plantControl;
    if (pageProxy.evaluateTargetPath('#Control:PlantPicker').getValue() && pageProxy.evaluateTargetPath('#Control:PlantPicker').getValue().length > 0) {
        plantControl = pageProxy.evaluateTargetPath('#Control:PlantPicker').getValue()[0].ReturnValue;
    }
    let workCenterControl;
    if (pageProxy.evaluateTargetPath('#Control:WorkCenterPicker').getValue() && pageProxy.evaluateTargetPath('#Control:WorkCenterPicker').getValue().length > 0) {
        workCenterControl = pageProxy.evaluateTargetPath('#Control:WorkCenterPicker').getValue()[0].ReturnValue;
    }

    let equipmentControl = pageProxy.getControl('FormCellContainer').getControl('EquipmentPicker');
    let equipmentTargetSpecifier = equipmentControl.getTargetSpecifier();
    let equipmentId = pageProxy.binding.EquipId;
    let equipFilter = '';

    if (!libVal.evalIsEmpty(equipmentId)) {
        equipFilter = " and EquipId ne '" + equipmentId + "'";
    }

    //Don't allow the parent equipment to be installed
    if (pageProxy.binding.hasOwnProperty('SuperiorEquip') && !libVal.evalIsEmpty(pageProxy.binding.SuperiorEquip)) {
        equipFilter += " and EquipId ne '" + pageProxy.binding.SuperiorEquip + "'";
    }

    let filter = "$filter=(ObjectStatus_Nav/SystemStatus_Nav/SystemStatus eq 'I0099' or ObjectStatus_Nav/SystemStatus_Nav/SystemStatus eq 'I0184') and SystemStatuses_Nav/all(s:s/Status ne 'I0076')" + equipFilter;
    let expand = '$expand=EquipDocuments,WorkCenter_Nav,ObjectStatus_Nav/SystemStatus_Nav';
    let orderBy = '$orderby=EquipId';

    if (!libVal.evalIsEmpty(equipmentCategory)) {
        filter = filter + ` and EquipCategory eq '${equipmentCategory}'`;
    }

    if (!libVal.evalIsEmpty(plantControl)) {
        filter = filter + ` and MaintPlant eq '${plantControl}'`;
    }

    if (!libVal.evalIsEmpty(workCenterControl)) {
        filter = filter +  ` and MaintWorkCenter eq '${workCenterControl}'`;
    }

    equipmentTargetSpecifier.setQueryOptions(filter + '&' + expand + '&' + orderBy);
    equipmentTargetSpecifier.setObjectCell({
        'PreserveIconStackSpacing': false,
        'Title' : '{{#Property:EquipDesc}}',
        'Subhead' : '/SAPAssetManager/Rules/Equipment/FormatWorkCenterAndPlant.js',
        'Footnote' : '{{#Property:EquipId}}',
    });
    
    equipmentControl.setTargetSpecifier(equipmentTargetSpecifier);
    hideCancel(context);
    libCom.saveInitialValues(context);
}
