import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function MileageAndUOM(context) {

    let returnString = `${context.localizeText('mileage')}`;
    let uom = CommonLibrary.getMileageUOM(context);

    if (uom) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `UsageUoMs('${uom}')`, ['Description'], '').then(result => {
            if (result.length > 0) {
                let uomRecord = result.getItem(0);
                let uomDescription = uomRecord.Description;

                if (uomDescription) {
                    returnString += ` (${uomDescription})`;
                }
            }

            return returnString;
        });
    }
    return returnString;
}
