import libVal from '../../Common/Library/ValidationLibrary';

export default function MeasuringPointFilterNav(context) {

    let sections = context.evaluateTargetPathForAPI('#Page:MeasuringPointsDetailsPage').getControl('FormCellContainer')._control.sectionsContexts;
    let Equipments = [];
    let FuncLocs = [];
    if (sections && sections.length > 0) {
        for (let section of sections) {
            let equipId = section.binding.EquipId;
            let funcLoc = section.binding.FuncLocIdIntern;
            if (!libVal.evalIsEmpty(equipId) && !Equipments.includes(equipId)) {
                Equipments.push(equipId);
            }
            if (!libVal.evalIsEmpty(funcLoc) && !FuncLocs.includes(funcLoc)) {
                FuncLocs.push(funcLoc);
            }
        }
    }
    context.evaluateTargetPathForAPI('#Page:MeasuringPointsDetailsPage').getClientData().Equipments = Equipments;
    context.evaluateTargetPathForAPI('#Page:MeasuringPointsDetailsPage').getClientData().FuncLocs = FuncLocs;
    return context.executeAction('/SAPAssetManager/Actions/Measurements/MeasuringPointFilterNav.action');
}
