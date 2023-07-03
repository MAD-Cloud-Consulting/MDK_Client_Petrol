import DiscardReadings from './DiscardReadings';
import DiscardGoodsMovement from './DiscardGoodsMovement';

export default function DiscardActionSwitch(context) {
    return context.executeAction('/SAPAssetManager/Actions/DiscardWarningMessage.action').then(function(result) {
        // Verify the user wants to proceed
        if (result.data === true) {
            // If the current page binding is local, we must be on a Disconnect/Reconnect, or an Install
            if (context.binding['@sap.isLocal']) {
                // If our binding is a DisconnectionObject, we're on a Disconnect/Reconnect
                if (context.getPageProxy().binding['@odata.type'] === '#sap_mobile.DisconnectionObject') {
                    let discardDisconnectAction;

                    //Due to an Offline OData limitation, we cannot use the UndoPendingChanges action if the object ran into a sync error
                    //Hence, the workaround is to delete the entity directly from the ErrorArchive
                    if (context.binding['@sap.inErrorState']) { 
                        discardDisconnectAction = '/SAPAssetManager/Actions/Meters/Discard/DiscardDisconnectFromErrorArchive.action';
                    } else {
                        discardDisconnectAction = '/SAPAssetManager/Actions/Meters/Discard/DiscardDisconnect.action';
                    }

                    return context.getPageProxy().executeAction(discardDisconnectAction).then(function() {
                        return context.count('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/DisconnectActivity_Nav/DisconnectObject_Nav', '$filter=sap.islocal()').then(function(count) {
                            if (count === 0) {

                                let discardActivityAction;

                                //Due to an Offline OData limitation, we cannot use the UndoPendingChanges action if the object ran into a sync error
                                //Hence, the workaround is to delete the entity directly from the ErrorArchive
                                if (context.binding.DisconnectActivity_Nav['@sap.inErrorState']) {
                                    discardActivityAction = '/SAPAssetManager/Actions/Meters/Discard/DiscardActivityFromErrorArchive.action';
                                } else {
                                    discardActivityAction = '/SAPAssetManager/Actions/Meters/Discard/DiscardActivity.action';
                                }

                                return context.getPageProxy().executeAction(discardActivityAction).then(function() {
                                    return context.getPageProxy().executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
                                });
                            } else {
                                return Promise.resolve();
                            }
                        });
                    });
                } else {
                    // Otherwise we must be on an install
                    return DiscardReadings(context).then(function() {
                        return DiscardGoodsMovement(context).then(function() {
                            let discardAction;

                            
                            //Due to an Offline OData limitation, we cannot use the UndoPendingChanges action if the object ran into a sync error
                            //Hence, the workaround is to delete the entity directly from the ErrorArchive
                            if (context.binding['@sap.inErrorState']) {
                                discardAction = '/SAPAssetManager/Actions/Meters/Discard/DiscardStatusInstallFromErrorArchive.action';
                            } else {
                                discardAction = '/SAPAssetManager/Actions/Meters/Discard/DiscardStatusInstall.action';
                            }

                            return context.getPageProxy().executeAction(discardAction).then(function() {
                                return context.getPageProxy().executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
                            });
                        });
                    });
                }
            } else {
                // Otherwise we must be on a removal
                return DiscardReadings(context).then(function() {
                    return DiscardGoodsMovement(context).then(function() {
                        let removalAction;

                        if (context.binding.Device_Nav['@sap.inErrorState']) {
                            removalAction = '/SAPAssetManager/Actions/Meters/Discard/DiscardStatusInstallFromErrorArchive.action';
                        } else {
                            removalAction = '/SAPAssetManager/Actions/Meters/Discard/DiscardRemove.action';
                        }

                        return context.getPageProxy().executeAction(removalAction).then(function() {
                            return context.getPageProxy().executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
                        });
                    });
                });
            }
        } else {
            return false;
        }
    });
}
