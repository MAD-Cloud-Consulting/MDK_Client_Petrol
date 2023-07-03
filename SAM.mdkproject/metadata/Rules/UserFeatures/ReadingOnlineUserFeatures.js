import Logger from '../Log/Logger';
import userfeaturesLib from '../UserFeatures/UserFeaturesLibrary';

export default function ReadingOnlineUserFeatures(context) {
    ///Read features enable for the user from UserFeatures online entity set
    return context.executeAction('/SAPAssetManager/Actions/OData/OpenOnlineService.action').then(function() {
        return context.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'UserFeatures', [], '').then(function(features) {
            if (features.length > 0) {
                userfeaturesLib.setUserFeatures(context,features);
            } else {
                Logger.error('UserFeatures','No user features enabled on the backend');
            }
        }).catch(() => {
            Logger.error('UserFeatures','Reading UserFeatures from online service failed');
        });
    }).catch(() => {
        Logger.error('UserFeatures','Connecting to online service failed');
    });
}
