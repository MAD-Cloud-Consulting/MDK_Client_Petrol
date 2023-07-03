import libNotifMobile from '../../Notifications/MobileStatus/NotificationMobileStatusLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';
import libAutoSync from '../../ApplicationEvents/AutoSync/AutoSyncLibrary';
/**
* Start Notification
* Independent of UI, necessary for context menu
* @param {IClientAPI} context
*/
export default function NotificationMobileStatusHandler(context) {
	let binding = context.binding;
	if (context.constructor.name === 'SectionedTableProxy') {
        binding = context.getPageProxy().getExecutedContextMenuItem().getBinding();
    }
	if (libMobile.isNotifHeaderStatusChangeable(context)) {
        let mobileStatus = libMobile.getMobileStatus(binding, context);

        if (mobileStatus && mobileStatus !== '') {
            let started = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
            let received = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
            let objectType = IsPhaseModelEnabled(context) ? libCommon.getAppParam(context,'OBJECTTYPE','Notification') : 'NOTIFICATION';
            let actionProperties = {
                'Properties': {
                    'ObjectKey' : binding.NotifMobileStatus_Nav.ObjectKey,
                    'MobileStatus': '',
                    'EffectiveTimestamp': '/SAPAssetManager/Rules/DateTime/CurrentDateTime.js',
                    'CreateUserGUID': '/SAPAssetManager/Rules/UserPreferences/UserPreferencesUserGuidOnCreate.js',
                    'CreateUserId': libCommon.getSapUserName(context),
                },
                'Target': {
                    'EntitySet': 'PMMobileStatuses',
                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                    'ReadLink' : binding.NotifMobileStatus_Nav['@odata.readLink'],
                },
                'Headers': {
                    'OfflineOData.NonMergeable': true,
                },
            };

            if (mobileStatus === received) {
                // Override is required since rule binding on NotificationStartUpdate.action will be wrong
                actionProperties.Properties.MobileStatus = started;
                if (!IsPhaseModelEnabled(context)) {
                    actionProperties.UpdateLinks = 
                    [{
                        'Property': 'OverallStatusCfg_Nav',
                        'Target':
                        {
                            'EntitySet': 'EAMOverallStatusConfigs',
                            'QueryOptions': `$filter=ObjectType eq '${objectType}' and MobileStatus eq '${started}'`,
                        },
                    }];
                }

                return context.executeAction({
                    'Name': '/SAPAssetManager/Actions/Notifications/NotificationStartUpdate.action',
                    'Properties': actionProperties,
                }).then(() => {
                    return context.executeAction('/SAPAssetManager/Actions/Notifications/NotificationMobileStatusSuccessMessage.action').then(() => {
                        return libAutoSync.autoSyncOnStatusChange(context);
                    });
                }, () => {
                    return context.executeAction('/SAPAssetManager/Actions/Notifications/NotificationMobileStatusFailureMessage.action');
                });
            } else if (mobileStatus === started) {
                const completed = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
                const success = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/SuccessParameterName.global').getValue());
                let allItemTasksComplete;
                let allTasksComplete;

                actionProperties.Properties.MobileStatus = completed;

                if (IsPhaseModelEnabled(context)) {//No need to check for tasks completion
                    allItemTasksComplete = Promise.resolve(true);
                    allTasksComplete = Promise.resolve(true);
                } else {
                    // Get number of Items with unfinished Item Tasks. If zero, return true
                    allItemTasksComplete = context.count('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/Items`, `$filter=ItemTasks/any(itmTask : itmTask/ItemTaskMobileStatus_Nav/MobileStatus ne '${completed}' and itmTask/ItemTaskMobileStatus_Nav/MobileStatus ne '${success}')`).then(count => {
                        return count === 0;
                    });
                    // Get number of unfinished Tasks. If zero, return true
                    allTasksComplete = context.count('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/Tasks`, `$filter=TaskMobileStatus_Nav/MobileStatus ne '${completed}' and TaskMobileStatus_Nav/MobileStatus ne '${success}'`).then(count => {
                        return count === 0;
                    });

                    actionProperties.UpdateLinks = 
                    [{
                        'Property': 'OverallStatusCfg_Nav',
                        'Target':
                        {
                            'EntitySet': 'EAMOverallStatusConfigs',
                            'QueryOptions': `$filter=ObjectType eq '${objectType}' and MobileStatus eq '${completed}'`,
                        },
                    }];

                }
                
                return Promise.all([allItemTasksComplete, allTasksComplete]).then(results => {
                    if (results[0] && results[1]) {
                        return libNotifMobile.showNotificationCompleteWarningMessage(context).then(proceed => {
                            if (proceed) {
                                return libNotifMobile.completeNotification(context, function() {
                                    return libNotifMobile.NotificationUpdateMalfunctionEnd(context).then(() => {
                                        return context.executeAction({
                                            'Name': '/SAPAssetManager/Actions/Notifications/NotificationStartUpdate.action',
                                            'Properties': actionProperties,
                                        }).then(() => {
                                            return context.executeAction('/SAPAssetManager/Actions/Notifications/NotificationMobileStatusSuccessMessage.action').then(() => {
                                                return libAutoSync.autoSyncOnStatusChange(context);
                                            });
                                        }, () => {
                                            return context.executeAction('/SAPAssetManager/Actions/Notifications/NotificationMobileStatusFailureMessage.action');
                                        });
                                    });
                                });
                            } else {
                                context.dismissActivityIndicator();
                                return '';
                            }
                        });
                        
                    } else {
                        return context.executeAction('/SAPAssetManager/Actions/Notifications/MobileStatus/NotificationTaskPendingError.action');
                    }
                });
            }
            context.dismissActivityIndicator();
            return '';
        }
        return context.executeAction('/SAPAssetManager/Actions/Notifications/NotificationMobileStatusFailureMessage.action');
    }
    return context.executeAction('/SAPAssetManager/Actions/Notifications/NotificationMobileStatusFailureMessage.action');

}
