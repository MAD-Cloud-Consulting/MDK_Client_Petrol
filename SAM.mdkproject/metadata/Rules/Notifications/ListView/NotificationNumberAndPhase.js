import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function NotificationNumberAndPhase(context) {
    let binding = context.binding;
    let subhead = binding.NotificationNumber;
    if (CommonLibrary.isDefined(binding.NotificationType)) {
        subhead += ' - ' + binding.NotificationType;
    }

    //Only show phase if mobile status is not started i.e. for non minor notifications
    const STARTED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    if (IsPhaseModelEnabled(context) && MobileStatusLibrary.getMobileStatus(binding, context) !== STARTED) {
        if (binding.NotifMobileStatus_Nav && binding.NotifMobileStatus_Nav.OverallStatusCfg_Nav && binding.NotifMobileStatus_Nav.OverallStatusCfg_Nav.PhaseDesc) {
            subhead += ` - ${binding.NotifMobileStatus_Nav.OverallStatusCfg_Nav.PhaseDesc}`;
        }
    }

    return subhead;
}
