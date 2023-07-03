import Logger from '../Log/Logger';
import libCommon from '../Common/Library/CommonLibrary';

export default function TokenRequest(context) {
    if (!libCommon.isOnlineServiceInitialized(context)) {
        return context.executeAction('/SAPAssetManager/Actions/OData/OpenOnlineService.action').then(function() {
            return context.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'OauthTokens', [], '$filter=ParameterGroup eq \'EXTERNALCONNECTIONS\'').then(function(result) {
                if (result && result.getItem(0) && result.getItem(0).OauthToken) {
                    let item = result.getItem(0);
                    let obj = {};
                    obj.access_token = item.OauthToken;
                    obj.expires_in = item.ExpiresIn;

                    return obj;
                }
                Logger.error('Failed to retrieve a valid token');
                return null;
            }).catch(function(err) {
                Logger.error(`Failed to complete the online read: ${err}`);
                return null;
            });
        }).catch(function(err) {
            // Could not open online service
            Logger.error(`Failed to open Online OData Service: ${err}`);
            return null;
        });
    }
    return context.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'OauthTokens', [], '$filter=ParameterGroup eq \'EXTERNALCONNECTIONS\'').then(function(result) {
        if (result && result.getItem(0) && result.getItem(0).OauthToken) {
            let item = result.getItem(0);
            let obj = {};
            obj.access_token = item.OauthToken;
            obj.expires_in = item.ExpiresIn;

            return obj;
        }
        Logger.error('Failed to retrieve a valid token');
        return null;
    }).catch(function(err) {
        Logger.error(`Failed to complete the online read: ${err}`);
        return null;
    });
}
