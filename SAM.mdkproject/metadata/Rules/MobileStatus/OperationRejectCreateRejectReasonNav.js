import libCom from '../Common/Library/CommonLibrary';
import NoteCreateNav from '../Notes/NoteCreateNav';
import mobileStatusUpdateOverride from './MobileStatusUpdateOverride';

export default function OperationRejectCreateRejectReasonNav(context) {
    return NoteCreateNav(context).then(() => {
        let statusElement = libCom.getStateVariable(context, 'RejectStatusElement');
        return context.executeAction(mobileStatusUpdateOverride(context, statusElement, 'OperationMobileStatus_Nav', '/SAPAssetManager/Rules/MobileStatus/OperationMobileStatusPostUpdate.js'));
    }).finally(() => {
        libCom.removeStateVariable(context, 'RejectStatusElement');
        libCom.removeStateVariable(context, 'IsOnRejectOperation');
    });
}
