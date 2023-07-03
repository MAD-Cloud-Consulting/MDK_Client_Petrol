import ComLib from '../../../Common/Library/CommonLibrary';
import NotificationLib from '../../../Notifications/NotificationLibrary';
import lamCopy from '../../CreateUpdate/NotificationItemCreateLAMCopy';


export default function NotificationItemCreateUpdateOnCommit(clientAPI) {

    return NotificationLib.NotificationItemCreateUpdateValidation(clientAPI).then((isValid) => {
        if (isValid) {
            if (ComLib.IsOnCreate(clientAPI)) {
                if (ComLib.isOnChangeset(clientAPI)) {
                    return clientAPI.executeAction({
                        'Name': '/SAPAssetManager/Actions/Notifications/Item/NotificationItemCreate.action',
                        'Properties': {
                            'OnSuccess' : '',
                        },
                    }).then(() => {
                        return lamCopy(clientAPI);
                    }).then(() => {
                        clientAPI.executeAction('/SAPAssetManager/Actions/Page/ClosePageNextChangeset.action');
                    });
                } else {
                    // If this is not already a change set, we want to make it one
                    ComLib.setOnChangesetFlag(clientAPI, true);
                    ComLib.resetChangeSetActionCounter(clientAPI);
                    ComLib.setStateVariable(clientAPI, 'ObjectCreatedName', 'NotificationItem');
                    let notificationItemCreateChangeSet = '/SAPAssetManager/Actions/Notifications/Item/NotificationItemCreateChangeSet.action';
                    return clientAPI.executeAction(notificationItemCreateChangeSet).then(() => {
                        return lamCopy(clientAPI);
                    }).then(() => {
                        clientAPI.executeAction('/SAPAssetManager/Actions/Page/ClosePageNextChangeset.action');
                    });
                }
            } else {
                return clientAPI.executeAction('/SAPAssetManager/Actions/Notifications/Item/NotificationItemUpdate.action');
            }
        } else {
            return Promise.resolve(false);
        }
    });
}
