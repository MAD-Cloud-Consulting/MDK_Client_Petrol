import libCom from '../../Common/Library/CommonLibrary';

export default function GetPhysicalInventoryDocumentItemStorageLocationValue(context) {
    return libCom.getStateVariable(context, 'PhysicalInventoryItemStorageLocation');
}
