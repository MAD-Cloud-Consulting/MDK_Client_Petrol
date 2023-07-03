import libCom from '../../Common/Library/CommonLibrary';
import val from '../../Common/Library/ValidationLibrary';
export default function PartCreateInitialValue(context) {
    if (context.binding && !val.evalIsEmpty(context.binding.ItemCategory)) {
        return context.binding.ItemCategory;
    }
    return libCom.getAppParam(context, 'PART', 'StockItemCategory');
}
