/**
* Describe this function...
* @param {IClientAPI} context
*/
import Logger from '../Log/Logger';
import libDigSig from '../DigitalSignature/DigitalSignatureLibrary';

export default async function DigitalSignatureCommit(context) {
    if (!libDigSig.isDigitalSignatureEnabled) {
        return false;
    }
    try {
        await context.executeAction('/SAPAssetManager/Actions/OData/CreateOnlineOData.action');
        let signatures = await context.read('/SAPAssetManager/Services/AssetManager.service', 'UserPreferences', [], "$filter=PreferenceGroup eq 'DIG_SIG_SIGNKEY'");
        let errorEntities = await context.read('/SAPAssetManager/Services/AssetManager.service', 'ErrorArchive', [], '');
        if (signatures && signatures.length > 0) {
            Logger.debug(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDigitalSignature/DigitalSignature.global').getValue(), 'Found ' + signatures.length + ' draft signatures');
            for (var i = 0; i<signatures.length; i++) {
                let signature = signatures.getItem(i);
                let name = signature.PreferenceName;
                let value = signature.PreferenceValue;
                
                var found = false;
                // check if this entity is in error archive
                if (errorEntities) {
                    for (var j = 0; j<errorEntities.length; j++) {
                        if (errorEntities.getItem(j).RequestURL === name) {
                            // this entity is in error, skip it
                            Logger.debug(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDigitalSignature/DigitalSignature.global').getValue(), 'Entity ' + name + ' is in ErrorArchive. Skipping...');
                            found = true;
                            break;
                        }
                    }
                }
                if (!found) {
                    let signatureParts = value.split('/');
                    if (signatureParts && signatureParts.length === 3) { // we know it was encoded as "Application/Object/SigningKey"
                        context.getClientData().SigningApplication = signatureParts[0];
                        context.getClientData().SigningApplicationSubObject = signatureParts[1];
                        context.getClientData().ApplicationObjectSignKey = signatureParts[2];
                        context.getClientData().SignatureReadLink = signature['@odata.readLink'];
                        Logger.debug(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDigitalSignature/DigitalSignature.global').getValue(), 'Now saving signature for: ' + name);
                        try {
                            await context.executeAction('/SAPAssetManager/Actions/OData/DigitalSignature/DigitalSignatureCommit.action');
                        } catch (error) {
                            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDigitalSignature/DigitalSignature.global').getValue(), 'Got error in saving signature: ' + error);
                            await context.executeAction('/SAPAssetManager/Actions/OData/DigitalSignature/DeleteDraftSignatureFromUserPrefs.action');
                        }
                    }
                }
            }
        } else {
            Logger.debug(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDigitalSignature/DigitalSignature.global').getValue(), 'No draft signatures found!');
            context.updateProgressBanner('No draft signatures found!');
        }
    } catch (error) {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDigitalSignature/DigitalSignature.global').getValue(), 'Got error in DigitalSignatureCommit.action: ' + error);
    }
}
