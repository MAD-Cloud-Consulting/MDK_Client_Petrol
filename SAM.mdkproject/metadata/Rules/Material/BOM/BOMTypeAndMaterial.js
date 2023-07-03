import libEval from '../../Common/Library/ValidationLibrary';
import {ItemCategoryVar} from '../../Common/Library/GlobalItemCategory';

export default function BOMTypeAndMaterial(context) {

    let categories = ItemCategoryVar.getItemCategories();
    
    if (!libEval.evalIsEmpty(categories) && !libEval.evalIsEmpty(context.binding.ItemText1)) {
        return categories[context.binding.ItemCategory] + ' - ' + context.binding.ItemText1;
    }
    if (!libEval.evalIsEmpty(categories) && !libEval.evalIsEmpty(context.binding.Component)) {
        return categories[context.binding.ItemCategory] + ' - ' + context.binding.Component;
    }
    if (!libEval.evalIsEmpty(context.binding.ItemText1)) {
        return context.binding.ItemText1;
    }
    return context.binding.Component;
}
