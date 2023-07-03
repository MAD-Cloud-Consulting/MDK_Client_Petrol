import IsOnCreate from '../Common/IsOnCreate';

export default function ServiceOrderMileageOrExpenseWorkCenter(context, defaultWorkCenter) {

    let binding = context.binding;

    if (IsOnCreate(context)) {
        let pageProxy = context.getPageProxy();

        if (defaultWorkCenter) { //if a default work center is defined then that takes priority
            return Promise.resolve(defaultWorkCenter);
        }

        if (binding && binding.OperationNo) {
            
            let queryOptions = `$filter=OrderId eq '${binding.OrderId}' and OperationNo eq '${binding.OperationNo}'`;

            if (queryOptions) {
                return pageProxy.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderOperations', ['MainWorkCenter'], queryOptions).then(results => {
                    if (results.length > 0) {
                        let operationRecord = results.getItem(0);
                        let mainWorkCenter = operationRecord.MainWorkCenter;
        
                        if (mainWorkCenter) {
                            return mainWorkCenter;
                        }
                    }
                    return '';
                });
            }
        } else {
            return Promise.resolve('');
        }

    } else {
        return Promise.resolve(binding.WorkCenter);
    }
}
