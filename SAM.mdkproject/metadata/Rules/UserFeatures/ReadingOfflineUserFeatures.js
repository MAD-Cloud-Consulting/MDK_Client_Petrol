import Logger from '../Log/Logger';
import userfeaturesLib from '../UserFeatures/UserFeaturesLibrary';

export default function ReadingOfflineUserFeatures(context) {
    ///Read features enable for the user from UserFeatures entity set
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserFeatures', [], '').then(function(features) {
            if (features.length > 0) {
                ///delete the preveous flags
                userfeaturesLib.diableAllFeatureFlags(context);
                //enable the new flags coming from the backend
                userfeaturesLib.setUserFeatures(context,features);         
            } else {
                userfeaturesLib.diableAllFeatureFlags(context);
                Logger.error('UserFeatures ','No Features were enable on the backend');
            }
        }).catch(() => {
            Logger.error('UserFeatures','Reading UserFeatures from online service failed');
        });
}
