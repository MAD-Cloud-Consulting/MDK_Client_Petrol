import commonLib from '../../Common/Library/CommonLibrary';
export default function MileageCount(context) {
    let mileageActivityType = commonLib.getMileageActivityType(context);

    if (mileageActivityType) {
        let queryOptions = `$filter=OrderID eq '${context.binding.OrderId}' and ActualDuration ne null and ActivityType eq '${mileageActivityType}'`;

        if (context.binding.OperationNo) {
            queryOptions += ` and Operation eq '${context.binding.OperationNo}'`;
        }

        return context.count('/SAPAssetManager/Services/AssetManager.service', 'Confirmations', queryOptions);
    } else {
        return 0;
    }
   
}
