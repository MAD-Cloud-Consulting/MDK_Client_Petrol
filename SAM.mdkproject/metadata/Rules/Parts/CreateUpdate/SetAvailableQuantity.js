import libCom from '../../Common/Library/CommonLibrary';
/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function SetAvailableQuantity(context) {
    let page = context.getPageProxy();
    let availableQuantityProperty = page.evaluateTargetPathForAPI('#Control:AvailableQuantity');
    let pageName = libCom.getPageName(page);
    if (pageName === 'VehicleIssueOrReceiptCreatePage') {
        let transferType = page.evaluateTargetPath('#Control:TransferSeg').getValue()[0].ReturnValue;
        let onlineSwitch = page.evaluateTargetPath('#Control:OnlineSwitch').getValue();
        if (transferType === context.localizeText('to_vehicle')) {
            let service = onlineSwitch ? '/SAPAssetManager/Services/OnlineAssetManager.service' : '/SAPAssetManager/Services/AssetManager.service';
            context.read(service, context.getValue()[0].ReturnValue, [], '').then(result => {
                availableQuantityProperty.setValue(result.getItem(0).UnrestrictedQuantity);
            });
        } else {
            context.executeAction('/SAPAssetManager/Actions/Parts/PartsCreateOnlineOData.action').then(function() {
                context.read('/SAPAssetManager/Services/OnlineAssetManager.service', context.getValue()[0].ReturnValue, [], '').then(result => {
                    availableQuantityProperty.setValue(result.getItem(0).UnrestrictedQuantity);
                });
            });
        }
    } else {
        if (context.binding) {
            availableQuantityProperty.setValue(context.binding.UnrestrictedQuantity);
        } else {
            context.read('/SAPAssetManager/Services/AssetManager.service', context.getValue()[0].ReturnValue, [], '').then(result => {
                availableQuantityProperty.setValue(result.getItem(0).UnrestrictedQuantity);
            });
        }
    }
}
