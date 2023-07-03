import libCom from '../../Common/Library/CommonLibrary';
import libEval from '../../Common/Library/ValidationLibrary';

export default function BOMChildrenCountOnline(context) {
    if (!libEval.evalIsEmpty(context.binding.ChildBoMId) && !libEval.evalIsEmpty(context.binding.ChildBoMCategory)) {
        return libCom.getEntitySetCountOnline(context, 'BOMItems', "$filter=BOMId%20eq%20'" + context.binding.ChildBoMId + "'%20and%20BOMCategory%20eq%20'" + context.binding.ChildBoMCategory + "'");
    }
    return 0;
}
