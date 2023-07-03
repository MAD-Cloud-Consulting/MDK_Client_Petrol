import checkDeviceregistration from './CheckDeviceCreation';
import Logger from '../Log/Logger';

export default function UnRegisterDevice(context) {
    return checkDeviceregistration(context).then(result => {
        if (result) {
            context.showActivityIndicator(context.localizeText('unregistering_device'));
            return context.executeAction('/SAPAssetManager/Actions/OData/CreateOnlineOData.action').then(() => {
                return context.executeAction('/SAPAssetManager/Actions/OData/DigitalSignature/DeleteTOTPDevice.action').then(() => {
                    context.dismissActivityIndicator();
                    return context.executeAction('/SAPAssetManager/Actions/OData/DigitalSignature/UsersPrefsTOTPDeviceDelete.action');
                }).catch((error) => {
                    Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDigitalSignature/DigitalSignature.global').getValue(), 'TOTP Unregister Device failed' + error);
                     context.dismissActivityIndicator();
                });
                }).catch((error) => {
                    Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDigitalSignature/DigitalSignature.global').getValue(), 'Online Service Failed' + error);
                    context.dismissActivityIndicator();
                });
        } else {
            return context.executeAction('/SAPAssetManager/Actions/DigitalSignature/TOTPDeviceNotRegiter.action');
        }
 }).catch(() => {
    return Promise.resolve();
 });
}
