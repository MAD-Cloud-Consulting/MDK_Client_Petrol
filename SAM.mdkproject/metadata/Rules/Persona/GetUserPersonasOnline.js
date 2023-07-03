import Logger from '../Log/Logger';
import appSettings from '../Common/Library/ApplicationSettings';
import personaLibrary from './PersonaLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function GetUserPersonasOnline(context) {
    return context.executeAction('/SAPAssetManager/Actions/OData/CreateOnlineOData.action').then(function() {
        return context.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'UserPersonas', [], '').then(function(userPersonasResults) {                
            personaLibrary.initializePersona(context, userPersonasResults);
            return context.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'UserSyncGroupDetails', [], '').then(function(userSyncGroupResults) {
                if (userSyncGroupResults && userSyncGroupResults.length > 0) {
                    appSettings.remove(context, 'SyncGroupCount');
                    appSettings.setNumber(context, 'SyncGroupCount', userSyncGroupResults.length);
                    for (let index = 0; index < userSyncGroupResults.length; index++) {
                        appSettings.remove(context, 'SyncGroup-'+index);
                        appSettings.setString(context, 'SyncGroup-'+index, userSyncGroupResults.getItem(index).EntitySetName);
                    }
                    Logger.info(`results: ${userSyncGroupResults.length}`);
                }
                return true;
            }).catch(function(err) {
                Logger.error(`Failed to read Online OData Service: ${err}`);
                context.getClientData().Error=err;
                return false;
            });
        }).catch(function(err) {
            Logger.error(`Failed to read Online OData Service: ${err}`);
            context.getClientData().Error=err;
            return false;
        });
    }).catch(function(err) {
        // Could not init online service
        Logger.error(`Failed to initialize Online OData Service: ${err}`);
        return false;
    });
}
