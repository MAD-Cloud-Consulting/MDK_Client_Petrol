import ComLib from '../../../Common/Library/CommonLibrary';
import NotificationLib from '../../../Notifications/NotificationLibrary';

export default function NotificationActivityCreateUpdateOnCommit(clientAPI) {
    
    return NotificationLib.NotificationActivityCreateUpdateValidation(clientAPI).then((isValid) => {
        if (isValid) {
            // If we are creating, start create action
            if (ComLib.IsOnCreate(clientAPI))	{
                ComLib.resetChangeSetActionCounter(clientAPI);
                ComLib.setOnChangesetFlag(clientAPI, true);
                ComLib.setStateVariable(clientAPI, 'ObjectCreatedName', 'Activity');
                return clientAPI.executeAction('/SAPAssetManager/Actions/Notifications/Activity/NotificationActivityCreateChangeSet.action');
            } else {
                // If not, kick off the update action
                return clientAPI.executeAction('/SAPAssetManager/Actions/Notifications/Activity/NotificationActivityUpdate.action');
            }
        } else {
            return Promise.resolve(false);
        }
    });
}
