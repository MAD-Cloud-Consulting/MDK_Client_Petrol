///This rule check if a TOTP Device exist for this user guid
////We need to check for just device id
////As long is there a row a device is register
///There should not be more than 1 row on UserPreferences
export default function CheckDeviceCreation(context) {
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'UserPreferences', '$filter=PreferenceName eq \'DeviceID\'').then(count => {
        if (count === 1) {
            return true;
        } else {
            return false;
        }
    }).catch(() => {
        return false;
     });
}
