import validation from '../../../SAPAssetManager/Rules/Common/Library/ValidationLibrary';
export default function GoodsMovementIgnore(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', context.getClientData().DeviceReadLink + '/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav', [], '').then(function(result) {
        if (result && result.length > 0) {
            let status = result.getItem(0).SystemStatus;
            if (status === 'I0184') {
                return 'false';
            } else if (status === 'I0100') {
                let movementTypeListPickerValue = context.evaluateTargetPath('#Control:MovementTypeLstPkr').getValue();
                if (!validation.evalIsEmpty(movementTypeListPickerValue)) {
                    let movementType = movementTypeListPickerValue[0].ReturnValue;
                    if (!validation.evalIsEmpty(movementType)) {
                        return 'false';
                    }
                }
            }
            return 'true';
        } else {
            return 'false';
        }
    });
}
