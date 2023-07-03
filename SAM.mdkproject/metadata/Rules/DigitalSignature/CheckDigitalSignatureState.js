import libcomm from '../Common/Library/CommonLibrary';
export default function CheckOperationDigitalSignatureState(context) {
    let readLink = context.binding['@odata.readLink'];
    let status = '';
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserPreferences', [], '$filter=PreferenceGroup eq \'DIG_SIG_SIGNKEY\'' )
    .then(results => {
        if (libcomm.isDefined(results)) {
            results.forEach(function(row) {
                if (row.PreferenceName === readLink) {
                    status = context.localizeText('completed');
                }
            });
            return status;
        } else {
            return status;
        }
 }).catch(() => {
    return status;
 });

}
