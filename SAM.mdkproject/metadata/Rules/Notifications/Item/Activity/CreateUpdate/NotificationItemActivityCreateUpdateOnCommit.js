import ComLib from '../../../../Common/Library/CommonLibrary';
import NotificationLib from '../../../../Notifications/NotificationLibrary';

export default function NotificationItemActivityCreateUpdateOnCommit(clientAPI) {

    return NotificationLib.NotificationActivityCreateUpdateValidation(clientAPI).then((isValid) => {
        if (isValid) {
            //Determine if we are on edit vs. create
            if (ComLib.IsOnCreate(clientAPI))	{
                ComLib.resetChangeSetActionCounter(clientAPI);
                ComLib.setOnChangesetFlag(clientAPI, true);
                ComLib.setStateVariable(clientAPI, 'ObjectCreatedName', 'Activity');
                return clientAPI.executeAction('/SAPAssetManager/Actions/Notifications/Item/NotificationItemActivityCreateChangeSet.action');
            } else {    
                return clientAPI.executeAction('/SAPAssetManager/Actions/Notifications/Item/NotificationItemActivityUpdate.action');
            }
        } else {
            return Promise.resolve(false);
        }
    });
}
