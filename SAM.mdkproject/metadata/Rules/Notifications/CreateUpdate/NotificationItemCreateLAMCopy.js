import libCommon from '../../Common/Library/CommonLibrary';
import lamEnabled from '../../LAM/LAMIsEnabled';
import lamDefault from '../../LAM/CreateUpdate/LAMGenericDefaultValues';

export default function NotificationItemCreateLAMCopy(context) {
    //Check to see if the notification we just added needs new LAM entries created
    if (lamEnabled(context)) {
        libCommon.removeStateVariable(context, 'LAMDefaultRow');
        libCommon.removeStateVariable(context, 'LAMCreateType');
        libCommon.removeStateVariable(context, 'LAMHeaderReadLink');
        libCommon.setStateVariable(context, 'LAMDefaultRow', '');
        let notif = libCommon.getStateVariable(context, 'LocalId');
        let item = libCommon.getStateVariable(context, 'lastLocalItemNumber'); //Item just added
        let row, expand, filter;
        if (notif && item) {
            let lamDefaultRow = '', tempRow;
            //Read the item row and its parent notif.  Work up the hierarchy looking for the first LAM record to use as a default
            expand = '$expand=LAMObjectDatum_Nav,Equipment,FunctionalLocation,Equipment/LAMObjectDatum_Nav,FunctionalLocation/LAMObjectDatum_Nav,Notification,Notification/LAMObjectDatum_Nav,Notification/Equipment,Notification/Equipment/LAMObjectDatum_Nav,Notification/FunctionalLocation,Notification/FunctionalLocation/LAMObjectDatum_Nav';
            filter = "&$filter=NotificationNumber eq '" + notif + "' and ItemNumber eq '" + item + "'";
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyNotificationItems', ['NotificationNumber'], expand + filter).then(function(results) {
                if (results && results.length > 0) {
                    row = results.getItem(0);
                    if (row.LAMObjectDatum_Nav) {
                        lamDefaultRow = row.LAMObjectDatum_Nav;
                    } else if (row.Equipment && row.Equipment.LAMObjectDatum_Nav) {
                        lamDefaultRow = row.Equipment.LAMObjectDatum_Nav;
                    } else if (row.FunctionalLocation && row.FunctionalLocation.LAMObjectDatum_Nav) {
                        lamDefaultRow = row.FunctionalLocation.LAMObjectDatum_Nav;
                    } else if (row.Notification && row.Notification.LAMObjectDatum_Nav && row.Notification.LAMObjectDatum_Nav.length > 0) {
                        for (var i = 0; i < row.Notification.LAMObjectDatum_Nav.length; i++) {
                            tempRow = row.Notification.LAMObjectDatum_Nav[i];
                            if (tempRow.ObjectType === 'QM') { //Find the header row
                                lamDefaultRow = tempRow;
                                break;
                            }
                        }
                    }
                    if (!lamDefaultRow) {
                        if (row.Notification && row.Notification.Equipment && row.Notification.Equipment.LAMObjectDatum_Nav) {
                            lamDefaultRow = row.Notification.Equipment.LAMObjectDatum_Nav;
                        } else if (row.Notification && row.Notification.FunctionalLocation && row.Notification.FunctionalLocation.LAMObjectDatum_Nav) {
                            lamDefaultRow = row.Notification.FunctionalLocation.LAMObjectDatum_Nav;
                        }
                    }
                }
                if (lamDefaultRow) { //We found a LAM default, so create a new LAM entry for this item
                    libCommon.setStateVariable(context, 'LAMDefaultRow', lamDefaultRow);
                    libCommon.setStateVariable(context, 'LAMCreateType', 'NotificationItem');
                    libCommon.setStateVariable(context, 'LAMHeaderReadLink', row['@odata.readLink']);
                    libCommon.setStateVariable(context, 'ObjectCreatedName', 'NotificationItem');
                    lamDefault(context); //Set the default values for this new LAM record
                    return context.executeAction('/SAPAssetManager/Actions/LAM/LAMGenericDataCreate.action').then(() => {
                        context.getBindingObject().TempLAMObjectType = '';
                    });
                }
                return Promise.resolve(false);
            });    
        }
        return Promise.resolve(false);
    }
    return Promise.resolve(false);  
}

