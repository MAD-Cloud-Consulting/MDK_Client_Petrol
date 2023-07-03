import libCommon from '../Common/Library/CommonLibrary';

export default function PartDescription(pageClientAPI) {
    let binding = pageClientAPI.binding;
    let stockItemCode = libCommon.getAppParam(pageClientAPI, 'PART', 'StockItemCategory');
    if (binding.hasOwnProperty('ItemCategory')) {
        if (binding.ItemCategory === stockItemCode) {
            return binding.ComponentDesc;
        } else {
            return binding.TextTypeDesc;
        }
    }
}
