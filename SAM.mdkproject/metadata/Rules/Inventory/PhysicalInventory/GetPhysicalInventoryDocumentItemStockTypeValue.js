import libCom from '../../Common/Library/CommonLibrary';

export default function GetPhysicalInventoryDocumentItemStockTypeValue(context) {
    return libCom.getStateVariable(context, 'PhysicalInventoryItemStockType');
}
