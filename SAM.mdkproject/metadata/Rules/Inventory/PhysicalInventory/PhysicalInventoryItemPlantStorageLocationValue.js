import libCom from '../../Common/Library/CommonLibrary';

export default function PhysicalInventoryItemPlantStorageLocationValue(context) {
    return libCom.getStateVariable(context, 'PhysicalInventoryItemPlant') + '/' + libCom.getStateVariable(context, 'PhysicalInventoryItemStorageLocation');
}
