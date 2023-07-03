import ExecuteActionWithAutoSync from '../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';
import IsCompleteAction from '../WorkOrders/Complete/IsCompleteAction';

export default function TOTPPartialUploadAfterDelete(context) {
        return context.executeAction('/SAPAssetManager/Actions/OData/DigitalSignature/UserPerfsTOTPDevicesPartialUploads.action').then(() => {
            if (IsCompleteAction(context)) {
                return Promise.resolve();
            }
            return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/CreateUpdateDelete/DeleteEntitySuccessMessage.action');
        }).catch(() => {
            return context.executeAction('/SAPAssetManager/Actions/OData/ODataUploadFailureMessage.action');
        });
}
