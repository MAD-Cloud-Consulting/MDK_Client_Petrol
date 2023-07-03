
import libVal from '../../Common/Library/ValidationLibrary';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';

export default function InspectionCharacteristicsFDCFilter(context) {

    let sections = context.evaluateTargetPathForAPI('#Page:InspectionCharacteristicsFDCUpdate').getControl('FormCellContainer')._control.sectionsContexts;
    let equipments = [];
    let funcLocs = [];
    let operations =[];

    if (sections && sections.length > 0) {
        for (let section of sections) {
            let odataType = section.binding['@odata.type'];
            if (odataType === '#sap_mobile.InspectionCharacteristic') {
                let equipId = (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Checklist.global').getValue()) && section.binding.EAMChecklist_Nav) ? section.binding.EAMChecklist_Nav.Equipment:section.binding.InspectionPoint_Nav.EquipNum;
                let funcLoc = (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Checklist.global').getValue()) && section.binding.EAMChecklist_Nav) ? section.binding.EAMChecklist_Nav.FunctionalLocation: section.binding.InspectionPoint_Nav.FuncLocIntern;
                let operationNum = (section.binding.EAMChecklist_Nav) ? section.binding.EAMChecklist_Nav.OperationNo : section.binding.InspectionPoint_Nav.OperationNo;

                if (!libVal.evalIsEmpty(equipId) && !equipments.includes(equipId)) {
                    equipments.push(equipId);
                }

                if (!libVal.evalIsEmpty(funcLoc) && !funcLocs.includes(funcLoc)) {
                    funcLocs.push(funcLoc);
                }

                if (!libVal.evalIsEmpty(operationNum) && !operations.includes(operationNum)) {
                    operations.push(operationNum);
                }
            }
        }
    }
    context.evaluateTargetPathForAPI('#Page:InspectionCharacteristicsFDCUpdate').getClientData().Equipments = equipments;
    context.evaluateTargetPathForAPI('#Page:InspectionCharacteristicsFDCUpdate').getClientData().FuncLocs = funcLocs;
    context.evaluateTargetPathForAPI('#Page:InspectionCharacteristicsFDCUpdate').getClientData().Operations = operations;
    return context.executeAction('/SAPAssetManager/Actions/InspectionCharacteristics/Update/InspectionCharacteristicsFDCFilterNav.action');

}
