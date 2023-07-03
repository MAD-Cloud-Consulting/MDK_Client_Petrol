import libMobile from '../../MobileStatus/MobileStatusLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import libOPMobile from './OperationMobileStatusLibrary';
import libClock from '../../ClockInClockOut/ClockInClockOutLibrary';
import libSuper from '../../Supervisor/SupervisorLibrary';
import libPersona from '../../Persona/PersonaLibrary';
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';

export default function OperationEnableMobileStatus(context, refresh=true) {

    return libClock.reloadUserTimeEntries(context, false, '', '', refresh).then(() => {
        //We don't allow local mobile status changes if App Parameter MOBILESTATUS - EnableOnLocalBusinessObjects = N
        let isLocal = libCommon.isCurrentReadLinkLocal(context.binding['@odata.readLink']);
        if (isLocal) {
            if (!libCommon.isAppParameterEnabled(context, 'MOBILESTATUS', 'EnableOnLocalBusinessObjects')) {
                return Promise.resolve(false);
            }
        }

        var started = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());

        if (libMobile.isHeaderStatusChangeable(context)) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding.WOHeader['@odata.readLink'], [], '$expand=OrderMobileStatus_Nav').then(function(result) {
                if (result && result.length > 0) {
                    let headerMobileStatus = libMobile.getMobileStatus(result.getItem(0), context);
                    return Promise.resolve(headerMobileStatus === started);
                } else {
                    return Promise.resolve(false);
                }
            });
        }

        if (libMobile.isOperationStatusChangeable(context)) {
            let mobileStatus = libMobile.getMobileStatus(context.binding, context);
            var received = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
            var transfer = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TransferParameterName.global').getValue());
            var complete = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
            var review = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
            var rejected = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/RejectedParameterName.global').getValue());
            var accepted = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/AcceptedParameterName.global').getValue());
            var travel = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TravelParameterName.global').getValue());
            var onsite = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/OnsiteParameterName.global').getValue());

            if (libPersona.isFieldServiceTechnician(context)) {
                if (libCommon.getWorkOrderAssnTypeLevel(context) !== 'Operation') {
                    return Promise.resolve(false);
                }
            }
            //User may be clocked in to this operation regardless of what mobile status is set to, so allow change
            //Status may have been changed by another user, so trap that here
            if (libClock.isBusinessObjectClockedIn(context) && libClock.allowClockInOverride(context, mobileStatus)) {
                return true;
            }
            return libSuper.isBusinessObjectEditable(context).then(editable => {
                if (!editable) {
                    return Promise.resolve(false); //Supervisor is enabled, user is a tech, work center assignments and this operation is not assigned to this user
                }
                return libClock.isUserClockedIn(context).then(clockedIn => {
                    if (mobileStatus === transfer || mobileStatus === complete) {
                        return Promise.resolve(false);
                    } else if (mobileStatus === started) {
                        if (libClock.isCICOEnabled(context)) {
                            //Started, but I am either not clocked in, or clocked in and this operation was started by me
                            if (!clockedIn || libClock.isBusinessObjectClockedIn(context)) { //JCL 2205 patch
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
                        if (libPersona.isFieldServiceTechnician(context)) {
                            return Promise.resolve(false);
                        }
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
                    } else if (mobileStatus === accepted || mobileStatus === travel || mobileStatus === onsite) {
                        return Promise.resolve(true);
                    } else if (mobileStatus === received && libPersona.isFieldServiceTechnician(context)) {
                        return Promise.resolve(true);
                    } else {
                        let isAnyOtherWorkOrderStartedPromise = libOPMobile.isAnyOperationStarted(context);
                        return isAnyOtherWorkOrderStartedPromise.then(isAnyOperationStarted => {
                            const assnType = libCommon.getWorkOrderAssignmentType(context);
                            if ((assnType === '4' || assnType === 'A') && (mobileStatus === transfer || isAnyOperationStarted)) {
                                return Promise.resolve(false);
                            } else if (isAnyOperationStarted && libCommon.isCurrentReadLinkLocal(context.binding['@odata.readLink'])) {
                                return Promise.resolve(false);
                            } else if (IsPhaseModelEnabled(context) && isAnyOperationStarted) {
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
