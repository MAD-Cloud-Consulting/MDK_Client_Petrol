import Logger from '../Log/Logger';
export default function CheckDeviceCreation(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserPreferences', [], '$filter=PreferenceName eq \'DeviceID\'' )
        .then(userProfile => {
            if (userProfile.getItem(0)) {
                return userProfile.getItem(0).PreferenceValue;
            } else {
                return Promise.reject();
            }
     }).catch((error) => {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDigitalSignature/DigitalSignature.global').getValue(), 'Device was not register' + error);
        return Promise.reject();
     });
}
