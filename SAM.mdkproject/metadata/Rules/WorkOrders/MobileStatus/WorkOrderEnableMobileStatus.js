import libMobile from '../../MobileStatus/MobileStatusLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import libClock from '../../ClockInClockOut/ClockInClockOutLibrary';
import libWOMobile from './WorkOrderMobileStatusLibrary';
import libSuper from '../../Supervisor/SupervisorLibrary';

export default function WorkOrderEnableMobileStatus(context, refresh=true) {

    return libClock.reloadUserTimeEntries(context, false, '', '', refresh).then(() => {
        //We don't allow local mobile status changes if App Parameter MOBILESTATUS - EnableOnLocalBusinessObjects = N
        let isLocal = libCommon.isCurrentReadLinkLocal(context.binding['@odata.readLink']);
        if (isLocal) {
            if (!libCommon.isAppParameterEnabled(context, 'MOBILESTATUS', 'EnableOnLocalBusinessObjects')) {
                return Promise.resolve(false);
            }
        }

        if (libMobile.isHeaderStatusChangeable(context)) {
            var woTransfer = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TransferParameterName.global').getValue());
            var woComplete = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
            var woStarted = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
            var review = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
            var rejected = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/RejectedParameterName.global').getValue());
            var mobileStatus = libMobile.getMobileStatus(context.binding, context);

            //User may be clocked in to this WO regardless of what mobile status is set to, so allow change
            //Status may have been changed by another user, so trap that here
            if (libClock.isBusinessObjectClockedIn(context) && libClock.allowClockInOverride(context, mobileStatus)) {
                return Promise.resolve(true);
            }
            return libSuper.isBusinessObjectEditable(context).then(editable => {
                if (!editable) {
                    return Promise.resolve(false); //Supervisor is enabled, user is a tech, work center assignments and this work order is not assigned to this user
                }
                return libClock.isUserClockedIn(context).then(clockedIn => {
                    if (mobileStatus === woTransfer || mobileStatus === woComplete || mobileStatus === 'D-COMPLETE') {
                        return Promise.resolve(false);
                    } else if (mobileStatus === woStarted) {
                        if (libClock.isCICOEnabled(context)) {
                            //I am either not clocked in (so allow starting this WO that somebody else started), or the status change was made by me
                            if (!clockedIn || libClock.isBusinessObjectClockedIn(context)) {
                                return Promise.resolve(true);
                            }
                            return Promise.resolve(false);
                        } else { //Clock in/out is disabled
                            return Promise.resolve(true);
                        }
                    } else if (mobileStatus === review) {
                        return libSuper.isUserSupervisor(context).then(isSupervisor => {
                            if (isSupervisor) { //Supervisor can approve
                                return Promise.resolve(true);
                            }
                            if (libSuper.isSupervisorFeatureEnabled(context)) {
                                if (context.binding.supervisorLocal) { //Tech can re-open a local review status object
                                    return Promise.resolve(true);
                                }
                            }
                            return Promise.resolve(false); //Review status has been transmitted, or feature not enabled so cannot edit
                        });
                    } else if (mobileStatus === rejected) {
                        return libSuper.isUserSupervisor(context).then(isSupervisor => {
                            if (isSupervisor) {
                                if (context.binding.supervisorLocal) { //Supervisor can approve a local rejection status before transmit
                                    return Promise.resolve(true);
                                }
                                return Promise.resolve(false);
                            }
                            if (libSuper.isSupervisorFeatureEnabled(context)) {
                                return Promise.resolve(true); //Tech can start and correct
                            }
                            return Promise.resolve(false); //Feature not enabled so cannot edit
                        });
                    } else {
                        let isAnyOtherWorkOrderStartedPromise = libWOMobile.isAnyWorkOrderStarted(context);
                        return isAnyOtherWorkOrderStartedPromise.then(isAnyWorkOrderStarted => {
                            if (isAnyWorkOrderStarted && libCommon.isCurrentReadLinkLocal(context.binding['@odata.readLink'])) {
                                return Promise.resolve(false);
                            } else {
                                return Promise.resolve(true);
                            }
                        });
                    }
                });
            });
        }
        return Promise.resolve(false);
    });
}
