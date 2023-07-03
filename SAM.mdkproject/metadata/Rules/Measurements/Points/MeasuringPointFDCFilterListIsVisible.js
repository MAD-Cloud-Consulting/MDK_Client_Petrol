
export default function MeasuringPointFDCFilterListIsVisible(context) {

    let skipEquipment = false;
    let skipFloc = false;
    let skipOperations = false;
    let skipPRT = false;

    if (context.binding['@odata.type'] === '#sap_mobile.MyEquipment') {
        skipEquipment = true;
        skipFloc = true;
        skipPRT = true;
        skipOperations = true;
    }
    if (context.binding['@odata.type'] === '#sap_mobile.MyFunctionalLocation') {
        skipFloc = true;
        skipPRT = true;
        skipOperations = true;
    }

    if (context.evaluateTargetPathForAPI('#Page:-Previous')._page.previousPage.id === 'PRTListViewPage') {
        skipPRT = true;
    }
    
    if (context.getName() === 'Equipment') {
        let equipments = context.evaluateTargetPathForAPI('#Page:MeasuringPointsDetailsPage').getClientData().Equipments;
        if (equipments && equipments.length > 0 && !skipEquipment) {
            return true;
        }
        return false;
    }
    if (context.getName() === 'FuncLoc') {
        let FuncLocs = context.evaluateTargetPathForAPI('#Page:MeasuringPointsDetailsPage').getClientData().FuncLocs;
        if (FuncLocs && FuncLocs.length > 0  && !skipFloc) {
           return true;
        }
        return false;
    }
    if (context.getName() === 'FilterPRT') {
        if (skipPRT) {
            return false;
        }
        return true;
    }
    if (context.getName() === 'Operations') {
        if (skipOperations) {
            return false;
        }
        return true;
    }
}
