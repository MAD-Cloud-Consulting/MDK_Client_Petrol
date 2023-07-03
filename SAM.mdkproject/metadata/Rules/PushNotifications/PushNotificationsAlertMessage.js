import libCom from '../Common/Library/CommonLibrary';
import downloadPush from './PushNotificationsDownload';
import setStateVariables from './PushNotificationsStateVariables';
import setSyncInProgressState from '../Sync/SetSyncInProgressState';
import isSyncInProgress from '../Sync/IsSyncInProgress';
import setPendingPushState from './SetPushNotificationsPendingState';
import isAndroid from '../Common/IsAndroid';
import getUnifiedKey from './PushNotificationPayloadKeys';
import libVal from '../Common/Library/ValidationLibrary';
import PersonaLibrary from '../Persona/PersonaLibrary';

export default function PushNotificationsAlertMessage(context, appEventData) {
    // clear badge number
    context.setApplicationIconBadgeNumber(0);
    let unifiedPayload;
    if (isAndroid(context)) {
        if (libVal.evalIsEmpty(appEventData.payload.notification)) {
            // When we receive push while the app is in background, the notification property
            // is empty so we have to use alert property which has the key-value pair similar
            // to iOS.
            libCom.setStateVariable(context,'AndroidBackgroundPush',true);
            unifiedPayload = JSON.parse(appEventData.payload.data.alert);
        } else {
            unifiedPayload = appEventData.payload.notification;
            libCom.setStateVariable(context,'AndroidBackgroundPush',false);
        }
        libCom.setStateVariable(context,'ObjectType',appEventData.payload.data.ObjectType);
    } else {
        libCom.setStateVariable(context,'ObjectType',appEventData.data.ObjectType);
        unifiedPayload = appEventData.payload.aps.alert;
    }

    var pushNotificationHeader = getHeaderKey(unifiedPayload[getUnifiedKey(context, 'localizedTitle')]);

    return libCom.showWarningDialog(context, context.localizeText(unifiedPayload[getUnifiedKey(context, 'localizedBody')]), context.localizeText(pushNotificationHeader, unifiedPayload[getUnifiedKey(context,'localizeTitleArguments')]), context.localizeText('download'), context.localizeText('later')).then((result) => {
        // store the payload in state variable so that it can be accessed later
        setStateVariables(context, unifiedPayload);
        if (result === true) {
            // if sync is not already in progress
            if (!isSyncInProgress(context)) {
                setSyncInProgressState(context, true);
                downloadPush(context, libCom.getStateVariable(context, 'ObjectType'));
            } else {
                setPendingPushState(context, true);
                return context.executeAction('/SAPAssetManager/Actions/SyncInProgressWhilePush.action');
            }
        }
        return '';
    });   
}

// Change the header of the alert message for the push notification if a persona is the Field Service Technician
function getHeaderKey(key) {
    if (key === 'WO_TITLE_KEY' && PersonaLibrary.isFieldServiceTechnician)
        return 'SO_TITLE_KEY';
    return key;
}
