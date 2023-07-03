import libVal from '../../Common/Library/ValidationLibrary';
import IsAndroid from '../../Common/IsAndroid';

export default function EquipmentPickerInitialQueryOptions(context) {
    // Redirect to PageProxy with Extension Control object
    if (IsAndroid(context)) {
        context = context.binding.clientAPI.getPageProxy();
    }

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

    let equipmentId = context.binding.EquipId;
    let filter = `$filter=(ObjectStatus_Nav/SystemStatus_Nav/SystemStatus eq 'I0099' or ObjectStatus_Nav/SystemStatus_Nav/SystemStatus eq 'I0184') and SystemStatuses_Nav/all(s:s/Status ne 'I0076') and EquipId ne '${equipmentId}'`;
    let expand = '$expand=EquipDocuments,WorkCenter_Nav,ObjectStatus_Nav/SystemStatus_Nav,SystemStatuses_Nav';
    let orderBy = '$orderby=EquipId';

    //Don't allow the parent equipment to be installed
    if (pageProxy.binding.hasOwnProperty('SuperiorEquip') && !libVal.evalIsEmpty(pageProxy.binding.SuperiorEquip)) {
        filter += " and EquipId ne '" + pageProxy.binding.SuperiorEquip + "'";
    }

    if (!libVal.evalIsEmpty(equipmentCategory)) {
        filter = filter + ` and EquipCategory eq '${equipmentCategory}'`;
    }

    if (!libVal.evalIsEmpty(plantControl)) {
        filter = filter + ` and MaintPlant eq '${plantControl}'`;
    } else if (!libVal.evalIsEmpty(pageProxy.binding.MaintPlant)) {
        filter = filter + ` and MaintPlant eq '${pageProxy.binding.MaintPlant}'`;
    }

    if (!libVal.evalIsEmpty(workCenterControl)) {
        filter = filter +  ` and MaintWorkCenter eq '${workCenterControl}'`;
    } else if (!libVal.evalIsEmpty(pageProxy.binding.MaintWorkCenter)) {
        filter = filter +  ` and MaintWorkCenter eq '${pageProxy.binding.MaintWorkCenter}'`;
    }

    return expand + '&' + orderBy + '&' + filter;
}
