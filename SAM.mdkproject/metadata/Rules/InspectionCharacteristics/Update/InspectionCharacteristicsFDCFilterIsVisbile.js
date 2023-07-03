
export default function InspectionCharacteristicsFDCFilterIsVisbile(context) {
    if (context.getName() === 'Equipment') {
        let equipments = context.evaluateTargetPathForAPI('#Page:InspectionCharacteristicsFDCUpdate').getClientData().Equipments;
        return equipments.length > 0;
    }

    if (context.getName() === 'FuncLoc') {
        let funcLocs = context.evaluateTargetPathForAPI('#Page:InspectionCharacteristicsFDCUpdate').getClientData().FuncLocs;
        return funcLocs.length > 0;
    }

    if (context.getName() === 'Operations') {
        let operations = context.evaluateTargetPathForAPI('#Page:InspectionCharacteristicsFDCUpdate').getClientData().Operations;
        return operations.length > 0;
    }
}
