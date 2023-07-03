
export default function InspectionCharacteristicsFDCFilterQueryOptions(context) {
    if (context.getName() === 'Equipment') {
        let equipments = context.evaluateTargetPathForAPI('#Page:InspectionCharacteristicsFDCUpdate').getClientData().Equipments;
        if (equipments && equipments.length > 0) {
            let equipOutput = [];
            for (let index in equipments) {
                equipOutput.push(`EquipId eq '${equipments[index]}'`);
            }
            return '$filter=(' + equipOutput.join(' or ') + ')&$orderby=EquipId';
        }
        return '';
    }

    if (context.getName() === 'FuncLoc') {
        let FuncLocs = context.evaluateTargetPathForAPI('#Page:InspectionCharacteristicsFDCUpdate').getClientData().FuncLocs;
        if (FuncLocs && FuncLocs.length > 0) {
            let flocOutput = [];
            for (let index in FuncLocs) {
                flocOutput.push(`FuncLocIdIntern eq '${FuncLocs[index]}'`);
            }
            return '$filter=(' + flocOutput.join(' or ') + ')&$orderby=FuncLocIdIntern';
        }
        return '';
    }

    if (context.getName() === 'Operations') {
        let operations = context.evaluateTargetPathForAPI('#Page:InspectionCharacteristicsFDCUpdate').getClientData().Operations;
        if (operations && operations.length > 0) {
            let operationOutput = [];
            for (let index in operations) {
                operationOutput.push(`OperationNo eq '${operations[index]}'`);
            }
            return '$filter=(' + operationOutput.join(' or ') + ')&$orderby=OperationNo';
        }
        return '';
    }

    return '';
}
