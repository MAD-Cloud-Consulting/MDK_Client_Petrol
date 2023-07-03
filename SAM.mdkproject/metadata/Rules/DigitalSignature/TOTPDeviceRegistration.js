import CheckDeviceCreation from './CheckDeviceCreation';
import checkDefaultDevice from './CheckDefaultDevice';
import libcomm from '../Common/Library/CommonLibrary';
import unregisterDefaultDevice from './UnRegisteringDefaultDevice';
import DigitalLib from './DigitalSignatureLibrary';
import Logger from '../Log/Logger';


export default function TOTPDeviceRegistration(context) {
    ///Check if default device
    return checkDefaultDevice(context).then(defaultDevice => {
        if (!defaultDevice) {
            ///If is not default Device, check if device was registered locally
            return CheckDeviceCreation(context).then(registered => {
                if (!registered) {
                    //Register
                    if (libcomm.isInitialSync(context)) {
                        ///If during initial sync propmt to resister now or later
                        return context.executeAction('/SAPAssetManager/Actions/DigitalSignature/TOTPDeviceRegistrationDuringInitialSyncMessage.action').then(successResult => {
                            if (successResult.data === true) {
                                return context.executeAction('/SAPAssetManager/Actions/DigitalSignature/PassphraseTOTPNav.action');
                            } else {
                                return context.executeAction('/SAPAssetManager/Actions/DigitalSignature/TOTPRegisterDeviceLater.action');
                            }
                        });
                    } else {
                        return context.executeAction('/SAPAssetManager/Actions/DigitalSignature/PassphraseTOTPNav.action');
                    }
                } else {
                    return Promise.resolve();
                }
            });
        } else {
            ///If its the device in UserPrefrs is same as user 
            return DigitalLib.IsCurrentDeviceDefaultDevice(context).then(IsExistingDevice => {
                if (IsExistingDevice === true) {
                    return Promise.resolve();
                } else {
                    //If defaulted device propmt user if they want to make this the new default device.
                    return context.executeAction('/SAPAssetManager/Actions/DigitalSignature/TOTPDeviceAlreadyRegisterWarning.action').then(function(result) {
                        if (result.data === true) {
                            //If they want to register current device as default. Unregister default device.
                            return unregisterDefaultDevice(context).then(Unregistered => {
                                if (Unregistered) {
                                    //Delete entry on UserPrefs if it exist or not. Then reregister
                                    return context.executeAction('/SAPAssetManager/Actions/DigitalSignature/UsersPrefsTOTPDefaultDeviceDelete.action').then(() => {
                                        return context.executeAction('/SAPAssetManager/Actions/DigitalSignature/PassphraseTOTPNav.action');
                                    }).catch(() => {
                                        return context.executeAction('/SAPAssetManager/Actions/DigitalSignature/PassphraseTOTPNav.action');
                                    });
                                    
                                } else {
                                    return Promise.resolve();
                                }
                            });
                        } else {
                            ////For the case of register on backend or from other device  
                            return context.count('/SAPAssetManager/Services/AssetManager.service', 'UserPreferences', '$filter=PreferenceName eq \'DeviceID\'').then(count => {
                                if (count === 0) {
                                    //for backend registration create an entry on userPrefs
                                    return context.executeAction('/SAPAssetManager/Actions/OData/DigitalSignature/UserPrefsTOTPDefaultDeviceCreate.action');
                                } 
                                if (count === 1) {
                                    //Behave as device that was register
                                    return Promise.resolve();
                                } else {
                                    ///There shouldn't be more than one row for device id
                                    Logger.info(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDigitalSignature/DigitalSignature.global').getValue(), 'There is more than one default device on userPrefs. Please make sure there is only one device id in userPrefs');
                                    return Promise.resolve();
                                }
                            }).catch(() => {
                                return Promise.resolve();
                             });
                            
                        }
                    });
                }
            });
        }
    }).catch(() => {
        return Promise.resolve();
    });
}
