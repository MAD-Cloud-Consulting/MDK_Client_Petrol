import libcomm from '../Common/Library/CommonLibrary';
export default function CheckDeviceCreation(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserPreferences', [], '$filter=PreferenceName eq \'DeviceGUID\'' )
        .then(userProfile => {
            if (userProfile.getItem(0)) {
                if (userProfile.getItem(0).UserGuid === libcomm.getUserGuid(context)) {
                    return userProfile.getItem(0)['@odata.readLink'];
                } else {
                    return Promise.reject();
                }
            } else {
                return Promise.reject();
            }
     }).catch(() => {
        return Promise.reject();
     });
}
