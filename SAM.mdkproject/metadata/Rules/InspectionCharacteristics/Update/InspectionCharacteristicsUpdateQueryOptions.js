import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';
export default function InspectionCharacteristicsUpdateQueryOptions(context) {
    if (context.binding['@odata.type'] === '#sap_mobile.InspectionLot' || context.binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
        if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Checklist.global').getValue()) && context.binding.WOHeader_Nav.EAMChecklist_Nav.length>0) {
            return '$expand=MasterInspChar_Nav,NotifItems_Nav,EAMChecklist_Nav/MyWOOperation_Nav,InspectionLot_Nav/WOHeader_Nav,EAMChecklist_Nav/Equipment_Nav,InspectionLot_Nav/WOHeader_Nav,EAMChecklist_Nav/FuncLoc_Nav,InspValuation_Nav,InspectionCode_Nav,InspectionMethod_Nav&$orderby=EAMChecklist_Nav/OperationNo,EAMChecklist_Nav/Equipment,EAMChecklist_Nav/FunctionalLocation,InspectionChar';
        } else {
            return '$expand=MasterInspChar_Nav,NotifItems_Nav,InspectionPoint_Nav/WOOperation_Nav,InspectionLot_Nav/WOHeader_Nav,InspectionPoint_Nav/Equip_Nav,InspectionLot_Nav/WOHeader_Nav,InspectionPoint_Nav/FuncLoc_Nav,InspValuation_Nav,InspectionCode_Nav,InspectionMethod_Nav&$orderby=InspectionPoint_Nav/OperationNo,InspectionPoint_Nav/EquipNum,InspectionPoint_Nav/FuncLocIntern,InspectionChar';
        }
    } else if (context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
        if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Checklist.global').getValue()) && context.binding.EAMChecklist_Nav.length>0) {
            return `$filter=EAMChecklist_Nav/OperationNo eq '${context.binding.OperationNo}' and EAMChecklist_Nav/OrderId eq '${context.binding.OrderId}'&$expand=MasterInspChar_Nav,NotifItems_Nav,EAMChecklist_Nav/MyWOOperation_Nav,InspectionLot_Nav/WOHeader_Nav,EAMChecklist_Nav/Equipment_Nav,InspectionLot_Nav/WOHeader_Nav,EAMChecklist_Nav/FuncLoc_Nav,InspValuation_Nav,InspectionCode_Nav,InspectionMethod_Nav&$orderby=EAMChecklist_Nav/OperationNo,EAMChecklist_Nav/Equipment,EAMChecklist_Nav/FunctionalLocation,InspectionChar`;
        } else {
            return `$filter=InspectionPoint_Nav/OperationNo eq '${context.binding.OperationNo}' and InspectionPoint_Nav/OrderId eq '${context.binding.OrderId}'&$expand=MasterInspChar_Nav,NotifItems_Nav,InspectionPoint_Nav/WOOperation_Nav,InspectionLot_Nav/WOHeader_Nav,InspectionPoint_Nav/Equip_Nav,InspectionLot_Nav/WOHeader_Nav,InspectionPoint_Nav/FuncLoc_Nav,InspValuation_Nav,InspectionCode_Nav,InspectionMethod_Nav&$orderby=InspectionPoint_Nav/OperationNo,InspectionPoint_Nav/EquipNum,InspectionPoint_Nav/FuncLocIntern,InspectionChar`;
        }
    } else if (context.binding['@odata.type'] === '#sap_mobile.EAMChecklistLink') {
        return '$expand=EAMChecklist_Nav,MasterInspChar_Nav,NotifItems_Nav,EAMChecklist_Nav/MyWOOperation_Nav,InspectionLot_Nav/WOHeader_Nav,EAMChecklist_Nav/Equipment_Nav,InspectionLot_Nav/WOHeader_Nav,EAMChecklist_Nav/FuncLoc_Nav,InspValuation_Nav,InspectionCode_Nav,InspectionMethod_Nav&$orderby=EAMChecklist_Nav/OperationNo,EAMChecklist_Nav/Equipment,EAMChecklist_Nav/FunctionalLocation,InspectionChar';
    } else if (context.binding['@odata.type'] === '#sap_mobile.InspectionPoint') {
        return '$expand=MasterInspChar_Nav,NotifItems_Nav,InspectionPoint_Nav/WOOperation_Nav,InspectionLot_Nav/WOHeader_Nav,InspectionPoint_Nav/Equip_Nav,InspectionLot_Nav/WOHeader_Nav,InspectionPoint_Nav/FuncLoc_Nav,InspValuation_Nav,InspectionCode_Nav,InspectionMethod_Nav&$orderby=InspectionPoint_Nav/OperationNo,InspectionPoint_Nav/EquipNum,InspectionPoint_Nav/FuncLocIntern,InspectionChar';
    }
    return '';
}
