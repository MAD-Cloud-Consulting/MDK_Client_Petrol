
import libCommon from '../../Common/Library/CommonLibrary';
import NotificationMobileStatusesFromTable from './NotificationMobileStatusesFromTable';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';
import EnableNotificationEdit from '../../UserAuthorizations/Notifications/EnableNotificationEdit';

export default function NotificationEnableMobileStatus(context) {

    if (EnableNotificationEdit(context) && MobileStatusLibrary.isNotifHeaderStatusChangeable(context)) {
        let binding = context.binding;

        //gets the correct binding when executing rule from context swipe menu
        if (context.getPageProxy().getExecutedContextMenuItem()) {
            binding = context.getPageProxy().getExecutedContextMenuItem().getBinding();
        }

        //We don't allow local mobile status changes if App Parameter MOBILESTATUS - EnableOnLocalBusinessObjects = N
        let isLocal = libCommon.isCurrentReadLinkLocal(binding['@odata.readLink']);
        if (isLocal) {
            if (!libCommon.isAppParameterEnabled(context, 'MOBILESTATUS', 'EnableOnLocalBusinessObjects')) {
                return Promise.resolve(false);
            }
        }

        if (IsPhaseModelEnabled(context)) {
            let started = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
            let mobileStatus = MobileStatusLibrary.getMobileStatus(binding, context);

            if (mobileStatus === started) {
                return Promise.resolve(true);
            }
        }

        return NotificationMobileStatusesFromTable(context).then((result) => {
            return result.length > 0;
        });
    } else {
        return Promise.resolve(false);
    }

    
}

