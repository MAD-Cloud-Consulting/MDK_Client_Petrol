import libCom from '../../Common/Library/CommonLibrary';

export default function PhysicalInventoryDocumentStorageLocation(context) {
    if (context.binding) {
        return context.binding.StorLocation;
    }
    return libCom.getUserDefaultStorageLocation();
}
