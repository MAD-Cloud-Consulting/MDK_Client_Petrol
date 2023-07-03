import ComLib from '../../../Common/Library/CommonLibrary';
import NotificationLib from '../../../Notifications/NotificationLibrary';

export default function NotificationTaskCreateUpdateOnCommit(clientAPI) {

    return NotificationLib.NotificationTaskCreateUpdateValidationRule(clientAPI).then((isValid) => {
        if (isValid) {
            //Determine if we are on edit vs. create
            if (ComLib.IsOnCreate(clientAPI))	{
                ComLib.resetChangeSetActionCounter(clientAPI);
                ComLib.setOnChangesetFlag(clientAPI, true);
                ComLib.setStateVariable(clientAPI, 'ObjectCreatedName', 'NotificationTask');
                return clientAPI.executeAction('/SAPAssetManager/Actions/Notifications/Task/NotificationTaskCreateChangeSet.action');
            } else {
                return clientAPI.executeAction('/SAPAssetManager/Actions/Notifications/Task/NotificationTaskUpdate.action');
            }
        } else {
            return Promise.resolve(false);
        }   
    });
    
}
