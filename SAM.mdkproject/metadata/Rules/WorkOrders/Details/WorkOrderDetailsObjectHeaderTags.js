import libWoMobile from '../MobileStatus/WorkOrderMobileStatusLibrary';
import libClock from '../../ClockInClockOut/ClockInClockOutLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import checkDigitalSignatureState from '../../DigitalSignature/CheckDigitalSignatureState';
import digitalSigLib from '../../DigitalSignature/DigitalSignatureLibrary';
export default function WorkOrderDetailsObjectHeaderTags(context) {
    let binding = context.getBindingObject();
    var tags = [];
    tags.push(context.getBindingObject().OrderType);
   
    if (context.getPageProxy().getClientData().isWOSigned) {
        tags.push(context.localizeText('SIGNED'));
    } 
    if (binding.MarkedJob && binding.MarkedJob.PreferenceValue && binding.MarkedJob.PreferenceValue === 'true') {
        tags.push(context.localizeText('FAVORITE'));
    }
    return libWoMobile.headerMobileStatus(context).then((mStatus) => {
        if (mStatus === 'D-COMPLETE') {
            return tags;
        }
        var woStarted = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
        if (libClock.isBusinessObjectClockedIn(context) && libClock.allowClockInOverride(context, mStatus)) { //Clock in/out feature enabled and user is clocked in to this WO, regardless of mobile status
            tags.push(context.localizeText(woStarted) + '-' + context.localizeText('clocked_in'));
            if (digitalSigLib.isDigitalSignatureEnabled(context)) {
                return checkDigitalSignatureState(context).then(function(state) {
                    if (state !== '') {
                        tags.push(state);
                        return tags;
                    } else {
                        return tags;
                    }
                }).catch(() => {
                    return tags;
                 });
            } else {
                return tags;
            }
        } else {
            tags.push(context.localizeText(mStatus));
            if (digitalSigLib.isDigitalSignatureEnabled(context)) {
                return checkDigitalSignatureState(context).then(function(state) {
                    if (state !== '') {
                        tags.push(context.localizeText('signed'));
                        return tags;
                    } else {
                        return tags;
                    }
                }).catch(() => {
                    return tags;
                 });
            } else {
                return tags;
            }
        }
    });
}
