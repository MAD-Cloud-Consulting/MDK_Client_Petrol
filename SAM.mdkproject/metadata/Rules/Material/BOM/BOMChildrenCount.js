import libCom from '../../Common/Library/CommonLibrary';
import libEval from '../../Common/Library/ValidationLibrary';

export default function BOMChildrenCount(context) {
    if (!libEval.evalIsEmpty(context.binding.ChildBoMId) && !libEval.evalIsEmpty(context.binding.ChildBoMCategory)) {
        return libCom.getEntitySetCount(context, 'BOMItems', "$filter=BOMId eq '" + context.binding.ChildBoMId + "' and BOMCategory eq '" + context.binding.ChildBoMCategory + "'");
    }
    return 0;
}
