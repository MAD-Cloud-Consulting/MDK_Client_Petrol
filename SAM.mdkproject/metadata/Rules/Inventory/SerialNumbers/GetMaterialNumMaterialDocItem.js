import libCom from '../../Common/Library/CommonLibrary';

export default function GetMaterialNumMaterialDocItem(target, arr, isSTO = false) {
    let binding = target;
    if (binding.PurchaseOrderItem_Nav) binding = binding.PurchaseOrderItem_Nav;
    else if (binding.StockTransportOrderItem_Nav) binding = binding.StockTransportOrderItem_Nav;

    if (binding.MaterialDocItem_Nav && binding.MaterialDocItem_Nav.length) {
        binding.MaterialDocItem_Nav.forEach(materialItem => {
            let isLocal = libCom.isCurrentReadLinkLocal(materialItem['@odata.readLink']);
            if ((!target['@odata.type'].includes('MaterialDocItem') || target.MaterialDocNumber + target.MatDocItem !== materialItem.MaterialDocNumber + materialItem.MatDocItem) && isLocal) {
                if (materialItem.SerialNum.length) {
                    if ((!isSTO || (isSTO && materialItem.MovementType === '101'))) {
                        materialItem.SerialNum.forEach(serial => {
                            const descItem = arr.find(item => item.SerialNumber === serial.SerialNum);
                            if (descItem) {
                                descItem.Description = materialItem.MaterialDocNumber + '/' + materialItem.MatDocItem;
                            }
                        });
                    }
                }
            }
        });
    }

    return arr;
}
