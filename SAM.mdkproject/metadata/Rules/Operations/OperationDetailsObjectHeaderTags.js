import OperationMobileStatus from '../MobileStatus/OperationMobileStatus';
import libClock from '../ClockInClockOut/ClockInClockOutLibrary';
import libCom from '../Common/Library/CommonLibrary';

export default function OperationDetailsObjectHeaderTags(context) {
    var tags = [];
    let status = OperationMobileStatus(context);
    let woStarted = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());

    return libClock.reloadUserTimeEntries(context).then(() => {
        if (libClock.isBusinessObjectClockedIn(context) && libClock.allowClockInOverride(context, status)) { //Clock in/out feature enabled and user is clocked in to this operation, regardless of mobile status
            status = context.localizeText(woStarted) + '-' + context.localizeText('clocked_in');
        }
        tags.push(context.getBindingObject().ControlKey);
        tags.push(status);
        return tags;
    });
}
