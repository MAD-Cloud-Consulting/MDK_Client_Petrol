import isSerialized from '../../Issue/SerialParts/SerialPartsAreAllowed';
import issuedSerialNumberQuery from '../../Issue/SerialParts/SerialNumbersIssuedQuery';

/**
* If serialized material, only allow return if number serial numbers exist
* @param {IClientAPI} context
*/
export default function PartReturnCreate(context) {

    let action = '/SAPAssetManager/Actions/Parts/PartReturnCreateChangeset.action';

    if (isSerialized(context)) {
        return issuedSerialNumberQuery(context).then((serialNumsArray) => {
            if (serialNumsArray && serialNumsArray.length > 0) {
                let binding = context.binding;
                binding.serialNumsArray = serialNumsArray;
                context.setActionBinding(binding);
            } else {
                action = '/SAPAssetManager/Actions/Parts/PartReturnNoSerialNums.action';
            }
            return context.executeAction(action);
        });
    } else {
        return context.executeAction(action);
    }
}
