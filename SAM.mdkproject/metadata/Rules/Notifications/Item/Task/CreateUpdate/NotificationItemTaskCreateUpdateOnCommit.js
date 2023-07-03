import ComLib from '../../../../Common/Library/CommonLibrary';
import NotificationLib from '../../../../Notifications/NotificationLibrary';

export default function NotificationItemTaskCreateUpdateOnCommit(clientAPI) {

    return NotificationLib.NotificationTaskCreateUpdateValidationRule(clientAPI).then((isValid) => {
        if (isValid) {
            //Determine if we are on edit vs. create
            if (ComLib.IsOnCreate(clientAPI))	{
                ComLib.resetChangeSetActionCounter(clientAPI);
                ComLib.setOnChangesetFlag(clientAPI, true);
                ComLib.setStateVariable(clientAPI, 'ObjectCreatedName', 'NotificationItemTask');
                return clientAPI.executeAction('/SAPAssetManager/Actions/Notifications/Item/NotificationItemTaskCreateChangeSet.action').then(function() {
                    ComLib.setOnCreateUpdateFlag(clientAPI, '');
                    ComLib.setOnChangesetFlag(clientAPI, false);
                });
            } else {
                return clientAPI.executeAction('/SAPAssetManager/Actions/Notifications/Item/NotificationItemTaskUpdate.action');
            }
        } else {
            return Promise.resolve(false);
        }
    });
}
