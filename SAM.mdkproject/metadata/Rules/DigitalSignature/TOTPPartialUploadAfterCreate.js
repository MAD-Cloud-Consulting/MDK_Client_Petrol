import ExecuteActionWithAutoSync from '../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';
import IsCompleteAction from '../WorkOrders/Complete/IsCompleteAction';

export default function TOTPPartialUploadAfterCreate(context) {
        return context.executeAction('/SAPAssetManager/Actions/OData/DigitalSignature/UserPerfsTOTPDevicesPartialUploads.action').then(() => {
            if (IsCompleteAction(context)) {
                return context.executeAction('/SAPAssetManager/Actions/DigitalSignature/CreateDigitalSignatureNav.action');
            }
            return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/DigitalSignature/TOTPDeviceUpdateSuccess.action');
        }).catch(() => {
            return context.executeAction('/SAPAssetManager/Actions/OData/ODataUploadFailureMessage.action');
        });
}
