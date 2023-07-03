export default function InspectionPointsFDCUpdateDone(context) {
    let extension = context.getControl('FormCellContainer')._control;
    return extension.executeChangeSet('/SAPAssetManager/Actions/WorkOrders/Operations/InspectionPoints/InspectionPointUpdateChangeSet.action').then(() => {
        return true;
    });
}
