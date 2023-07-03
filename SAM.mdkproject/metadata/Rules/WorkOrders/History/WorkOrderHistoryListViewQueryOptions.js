import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function WorkOrderHistoryListViewQueryOptions(context) {
    const { searchString } = context;

    let referenceType = libCom.getTargetPathValue(context, '#Page:-Previous/#ClientData/#Property:ReferenceType');

    const qob = context.dataQueryBuilder();
    qob.expand('HistoryLongText', 'HistoryPriority');
    qob.orderBy('Priority', 'OrderId desc');

    if (!libVal.evalIsEmpty(referenceType)) {
        if (referenceType === 'P') {
            qob.filter("ReferenceType eq 'P'");
        } else {
            qob.filter("ReferenceType eq 'H'");
        }
    }

    if (searchString) {
        const search = qob.filterTerm().or(`substringof('${searchString.toLowerCase()}', tolower(OrderDescription))`, qob.mdkSearch(searchString));
        if (qob.hasFilter) {
            qob.filter().and(search);
        } else {
            qob.filter(search);
        }
    }

    return qob;
}
