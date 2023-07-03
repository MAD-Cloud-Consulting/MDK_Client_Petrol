import libVal from '../../Common/Library/ValidationLibrary';
import WorkOrdersFSMQueryOption from '../../WorkOrders/ListView/WorkOrdersFSMQueryOption';

/**
* Restrict query options to get only service orders
*/
export default function OrderIdQueryOptions(context) {
    return WorkOrdersFSMQueryOption(context).then(fsmQueryOptions => {
        if (!libVal.evalIsEmpty(fsmQueryOptions)) {
            return '$filter=' + fsmQueryOptions;
        }
        return '';
    });
}
