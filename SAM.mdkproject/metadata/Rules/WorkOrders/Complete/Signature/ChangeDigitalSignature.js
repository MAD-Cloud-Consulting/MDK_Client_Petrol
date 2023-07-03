import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';
import deviceRegistration from '../../../DigitalSignature/TOTPDeviceRegistration';
import checkDeviceRegistration from '../../../DigitalSignature/CheckDeviceCreation';

export default function ChangeDigitalSignature(context) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    context.getPageProxy().setActionBinding(binding);

    return checkDeviceRegistration(context).then(registered => {
        if (!registered) {
            // Needs to register and do digital signarure
            return deviceRegistration(context).then(() => {
                ///Check that it was properly register again
                return checkDeviceRegistration(context).then(deviceIsRegistered => {
                    if (deviceIsRegistered) {
                        //do digital signarure
                        return context.executeAction('/SAPAssetManager/Actions/DigitalSignature/CreateDigitalSignatureNav.action');
                    } else {
                        return Promise.reject();
                    }
                });
            }).catch(() => {
                return Promise.reject();
            });
        } else {
            return context.executeAction('/SAPAssetManager/Actions/DigitalSignature/CreateDigitalSignatureNav.action');
        }
    });
}
