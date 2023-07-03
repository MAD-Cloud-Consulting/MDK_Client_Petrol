
import Logger from '../Log/Logger';
export default function GetTOTPOnLoaded(context) {
    context.showActivityIndicator(context.localizeText('create_device'));
    return context.executeAction('/SAPAssetManager/Actions/OData/CreateOnlineOData.action').then(() => {
        return context.executeAction('/SAPAssetManager/Actions/OData/DigitalSignature/CreateTOTPDevice.action').then(() => {
            context.dismissActivityIndicator();
        }).catch((error) => {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDigitalSignature/DigitalSignature.global').getValue(), 'TOTP Create Device failed' + error);
            context.dismissActivityIndicator();
        });
    }).catch((error) => {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDigitalSignature/DigitalSignature.global').getValue(), 'Online Service Failed' + error);
        context.dismissActivityIndicator();
    });
}
