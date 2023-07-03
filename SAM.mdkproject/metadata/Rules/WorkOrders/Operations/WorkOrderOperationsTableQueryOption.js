import { OperationConstants as Constants } from './WorkOrderOperationLibrary';

export default function WorkOrderOperationsTableQueryOption(context) {
    let query = Constants.OperationListQueryOptions(context) + '&$top=2';
    return query;
}
