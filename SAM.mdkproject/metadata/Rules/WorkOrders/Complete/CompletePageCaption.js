import WorkOrderCompletionLibrary from './WorkOrderCompletionLibrary';

export default function CompletePageCaption(context) {

    if (WorkOrderCompletionLibrary.getInstance().isWOFlow()) {
        let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', [], `$filter=PlanningPlant eq '${binding.PlanningPlant}' and OrderType eq '${binding.OrderType}'`).then((result) => {
            if (result.length > 0 && result.getItem(0).ServiceType === 'X') {
                return context.localizeText('complete_order');
            }

            return context.localizeText('complete_work_order');
        });
    }

    if (WorkOrderCompletionLibrary.getInstance().isSubOperationFlow()) {
        return context.localizeText('complete_sub_operation');
    }

    return context.localizeText('complete_operation');
}
