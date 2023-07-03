export default function InspectionCharacteristicsFDCUpdateDone(context) {
    let extension = context.getControl('FormCellContainer')._control;
    if (extension._sectionCells.length === extension.sectionsContexts.length) {
        extension.sectionsContexts.pop(); //remove the last button - Control.Type.FormCell.Button - Validate All 
    } 
    return extension.executeChangeSet('/SAPAssetManager/Actions/InspectionCharacteristics/Update/InspectionCharacteristicsUpdateChangeSet.action');
}
