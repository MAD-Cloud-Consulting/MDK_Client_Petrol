import signatureCreateBDSLinkNoClose from '../Create/SignatureCreateBDSLinkNoClose';
import DownloadAndSaveMedia from '../../Documents/DownloadAndSaveMedia';
import libCommon from '../../Common/Library/CommonLibrary';
import IsCompleteAction from '../../WorkOrders/Complete/IsCompleteAction';

export default function SignatureCreateBDSLink(controlProxy) {
    return signatureCreateBDSLinkNoClose(controlProxy).then(() => {
        return DownloadAndSaveMedia(controlProxy).then(() => {
            libCommon.setStateVariable(controlProxy, 'ObjectCreatedName', 'Signature');
            if (IsCompleteAction(controlProxy)) {
                return Promise.resolve();
            }
            return controlProxy.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntitySuccessMessage.action');
        });
    })
   .catch(() => controlProxy.executeAction('/SAPAssetManager/Actions/Documents/DocumentCreateLinkFailure.action'));
}
