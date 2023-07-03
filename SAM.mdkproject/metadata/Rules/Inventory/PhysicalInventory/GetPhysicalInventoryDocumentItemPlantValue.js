import libCom from '../../Common/Library/CommonLibrary';

export default function GetPhysicalInventoryDocumentItemPlantValue(context) {
    return libCom.getStateVariable(context, 'PhysicalInventoryItemPlant');
}
