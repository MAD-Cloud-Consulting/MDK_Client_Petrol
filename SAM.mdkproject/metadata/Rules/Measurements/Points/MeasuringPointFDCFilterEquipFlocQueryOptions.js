export default function MeasuringPointFDCFilterEquipFlocQueryOptions(context) {
    if (context.getName() === 'Equipment') {
        let equipments = context.evaluateTargetPathForAPI('#Page:MeasuringPointsDetailsPage').getClientData().Equipments;
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
        let FuncLocs = context.evaluateTargetPathForAPI('#Page:MeasuringPointsDetailsPage').getClientData().FuncLocs;
        if (FuncLocs && FuncLocs.length > 0) {
            let flocOutput = [];
            for (let index in FuncLocs) {
                flocOutput.push(`FuncLocIdIntern eq '${FuncLocs[index]}'`);
            }
            return '$filter=(' + flocOutput.join(' or ') + ')&$orderby=FuncLocIdIntern';
        }
        return '';
    }
    return '';
}
