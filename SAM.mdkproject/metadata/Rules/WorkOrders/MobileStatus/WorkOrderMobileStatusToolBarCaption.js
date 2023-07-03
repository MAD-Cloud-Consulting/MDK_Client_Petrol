import libWOMobile from './WorkOrderMobileStatusLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import libClock from '../../ClockInClockOut/ClockInClockOutLibrary';
import libSuper from '../../Supervisor/SupervisorLibrary';
import libPersona from '../../Persona/PersonaLibrary';
import { WorkOrderLibrary as libWo } from '../WorkOrderLibrary';

export default function WorkOrderMobileStatusToolBarCaption(context) {

    return libClock.reloadUserTimeEntries(context).then(() => {
        var woReceived = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
        var woHold = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
        var woStarted = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
        var woTransfer = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TransferParameterName.global').getValue());
        var woComplete = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
        var woTravel = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TravelParameterName.global').getValue());
        var woOnsite = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/OnsiteParameterName.global').getValue());
        let review = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
        let rejected = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/RejectedParameterName.global').getValue());

        return libWOMobile.headerMobileStatus(context).then((mobileStatus) => {
            //User may be clocked in to this WO locally regardless of what mobile status is set to
            //Status may have been changed by another user, so trap that here
            if (libClock.isBusinessObjectClockedIn(context) && libClock.allowClockInOverride(context, mobileStatus)) {
                return Promise.resolve(context.localizeText('clock_out'));
            } else {
                if (mobileStatus === woReceived || mobileStatus === woHold || mobileStatus === woOnsite) {
                    //This order is not started. It is currently either on hold or received status.
                    let isAnyOtherWorkOrderStartedPromise = libWOMobile.isAnyWorkOrderStarted(context);
                    return isAnyOtherWorkOrderStartedPromise.then(
                        isAnyWorkOrderStarted => {
                            if (isAnyWorkOrderStarted) {
                                let caption = libPersona.isMaintenanceTechnician(context) ? context.localizeText('transfer') : context.localizeText('enroute');
                                return Promise.resolve(caption);
                            } else {
                                if (libClock.isCICOEnabled(context)) {
                                    return Promise.resolve(context.localizeText('clock_in'));
                                } else {
                                    return showStartWorkOrderCaption(context);
                                }
                            }
                        }
                    );
                } else if (mobileStatus === woStarted) {
                    if (libClock.isCICOEnabled(context)) { //Handle clock in/out feature
                        if (libClock.isBusinessObjectClockedIn(context)) { //JCL 2205 patch
                            return Promise.resolve(context.localizeText('clock_out')); //This WO status was last changed by me
                        } else {
                            return Promise.resolve(context.localizeText('clock_in')); //This work order was started by someone else, so current user can also start it
                        }
                    } else {
                        return showEndWorkOrderCaption(context);
                    }
                } else if (mobileStatus === woTransfer) {
                    return Promise.resolve(context.localizeText('transferred'));
                } else if (mobileStatus === woComplete) {
                    return Promise.resolve(context.localizeText('completed'));
                } else if (mobileStatus === review) {
                    return libSuper.isUserSupervisor(context).then(result => {
                        if (result) { //Supervisor has approve/reject option
                            return Promise.resolve(context.localizeText('review_text'));
                        }
                        return showRestartWorkOrderCaption(context);
                    });
                } else if (mobileStatus === rejected) {
                    return libSuper.isUserSupervisor(context).then(result => {
                        if (result) {
                            return Promise.resolve(context.localizeText('edit_review')); //Supervisor can edit any review
                        }
                        let isAnyOtherWorkOrderStartedPromise = libWOMobile.isAnyWorkOrderStarted(context);
                        return isAnyOtherWorkOrderStartedPromise.then(isAnyWorkOrderStarted => { //Tech will see the start or transfer option
                            if (isAnyWorkOrderStarted) {
                                return Promise.resolve(context.localizeText('transfer'));
                            } else {
                                if (libClock.isCICOEnabled(context)) {
                                    return Promise.resolve(context.localizeText('clock_in'));
                                } else {
                                    return showStartWorkOrderCaption(context);
                                }
                            }
                        });
                    });
                } else if (mobileStatus === woTravel) {
                    return Promise.resolve(context.localizeText('onsite'));
                } else if (mobileStatus === 'D-COMPLETE') {
                    return Promise.resolve(' ');
                }
            }
            return Promise.resolve(context.localizeText(mobileStatus));
        }).catch(() => {
            return Promise.resolve(context.localizeText('status'));
        });
    });
}

function showStartWorkOrderCaption(context) {
    return libWo.isServiceOrder(context).then(isServiceOrder => {
        if (isServiceOrder)
            return context.localizeText('start_serviceorder');
        else
            return context.localizeText('start_workorder');
    });
}

function showEndWorkOrderCaption(context) {
    return libWo.isServiceOrder(context).then(isServiceOrder => {
        if (isServiceOrder)
            return context.localizeText('end_serviceorder');
        else
            return context.localizeText('end_workorder');
    });    
}

function showRestartWorkOrderCaption(context) {
    return libWo.isServiceOrder(context).then(isServiceOrder => {
        if (isServiceOrder)
            return context.localizeText('restart_serviceorder');
        else
            return context.localizeText('restart_workorder');
    });
}
