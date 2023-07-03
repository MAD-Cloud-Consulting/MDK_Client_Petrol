import libCom from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';
import libThis from './DigitalSignatureLibrary';
import libVal from '../Common/Library/ValidationLibrary';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';

export default class {
    /**
* Describe this function...
* @param {IClientAPI} context
*/
    static logCategory(context) {
        return context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDigitalSignature/DigitalSignature.global').getValue();
    }
    
    static isDigitalSignatureEnabled(context) {
        var isDigSigRequired = (libCom.getAppParam(context, 'DIGITALSIGNATURE', 'WO.Complete')  === 'Y') || 
                                (libCom.getAppParam(context, 'DIGITALSIGNATURE', 'OP.Complete')  === 'Y') || 
                                (libCom.getAppParam(context, 'DIGITALSIGNATURE', 'NO.Complete')  === 'Y') || 
                                (libCom.getAppParam(context, 'DIGITALSIGNATURE', 'WO.Complete')  === 'O') || 
                                (libCom.getAppParam(context, 'DIGITALSIGNATURE', 'OP.Complete')  === 'O') ||
                                (libCom.getAppParam(context, 'DIGITALSIGNATURE', 'NO.Complete')  === 'O') ;
        Logger.info(libThis.logCategory(context), 'isDigitalSignatureEnabled = ' + isDigSigRequired);
        return isDigSigRequired && userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/DigitalSignature.global').getValue());
    }

    static isWODigitalSignatureEnabled(context) {
        var isDigSigRequired = (libCom.getAppParam(context, 'DIGITALSIGNATURE', 'WO.Complete')  === 'Y') || 
                                (libCom.getAppParam(context, 'DIGITALSIGNATURE', 'WO.Complete')  === 'O');
        Logger.info(libThis.logCategory(context), 'isWODigitalSignatureEnabled = ' + isDigSigRequired);
        return isDigSigRequired && userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/DigitalSignature.global').getValue());
    }

    static isOPDigitalSignatureEnabled(context) {
        var isDigSigRequired = (libCom.getAppParam(context, 'DIGITALSIGNATURE', 'OP.Complete')  === 'Y') || 
                                (libCom.getAppParam(context, 'DIGITALSIGNATURE', 'OP.Complete')  === 'O');
        Logger.info(libThis.logCategory(context), 'isOPDigitalSignatureEnabled = ' + isDigSigRequired);
        return isDigSigRequired && userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/DigitalSignature.global').getValue());
    }

    static isNODigitalSignatureEnabled(context) {
        var isDigSigRequired = (libCom.getAppParam(context, 'DIGITALSIGNATURE', 'NO.Complete')  === 'Y') || 
                                (libCom.getAppParam(context, 'DIGITALSIGNATURE', 'NO.Complete')  === 'O');
        Logger.info(libThis.logCategory(context), 'isNODigitalSignatureEnabled = ' + isDigSigRequired);
        return isDigSigRequired && userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/DigitalSignature.global').getValue());
    }

    static isWODigitalSignatureMandatory(context) {
        var isDigSigRequired = (libCom.getAppParam(context, 'DIGITALSIGNATURE', 'WO.Complete')  === 'Y');
        Logger.info(libThis.logCategory(context), 'isWODigitalSignatureMandatory = ' + isDigSigRequired);
        return isDigSigRequired && userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/DigitalSignature.global').getValue());
    }

    static isOPDigitalSignatureMandatory(context) {
        var isDigSigRequired = (libCom.getAppParam(context, 'DIGITALSIGNATURE', 'OP.Complete')  === 'Y');
        Logger.info(libThis.logCategory(context), 'isOPDigitalSignatureMandatory = ' + isDigSigRequired);
        return isDigSigRequired && userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/DigitalSignature.global').getValue());
    }

    static isNODigitalSignatureMandatory(context) {
        var isDigSigRequired = (libCom.getAppParam(context, 'DIGITALSIGNATURE', 'NO.Complete')  === 'Y');
        Logger.info(libThis.logCategory(context), 'isNODigitalSignatureMandatory = ' + isDigSigRequired);
        return isDigSigRequired && userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/DigitalSignature.global').getValue());
    }

    static isWODigitalSignatureOptional(context) {
        var isDigSigRequired = (libCom.getAppParam(context, 'DIGITALSIGNATURE', 'WO.Complete')  === 'O');
        Logger.info(libThis.logCategory(context), 'isWODigitalSignatureOptional = ' + isDigSigRequired);
        return isDigSigRequired && userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/DigitalSignature.global').getValue());
    }

    static isOPDigitalSignatureOptional(context) {
        var isDigSigRequired = (libCom.getAppParam(context, 'DIGITALSIGNATURE', 'OP.Complete')  === 'O');
        Logger.info(libThis.logCategory(context), 'isOPDigitalSignatureOptional = ' + isDigSigRequired);
        return isDigSigRequired && userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/DigitalSignature.global').getValue());
    }

    static isNODigitalSignatureOptional(context) {
        var isDigSigRequired = (libCom.getAppParam(context, 'DIGITALSIGNATURE', 'NO.Complete')  === 'O');
        Logger.info(libThis.logCategory(context), 'isNODigitalSignatureOptional = ' + isDigSigRequired);
        return isDigSigRequired && userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/DigitalSignature.global').getValue());
    }

    static getDeviceId(context) {
        var deviceId = context.evaluateTargetPath('#Application/#ClientData/DeviceId');
        Logger.info(libThis.logCategory(context), 'Device id = ' + deviceId);
        return deviceId;
    }

    static isDeviceRegistered() {
        // check User Parameters
    }

    static readConfiguration(context) {
        // get the applicaiton object from object type
        let configuration = {};
        let type = '';
        switch (context.binding['@odata.type']) {
            case '#sap_mobile.MyWorkOrderHeader':
                type = 'OR';
                break;
            case '#sap_mobile.MyNotificationHeader':
                type = 'QM';
                break;
            case '#sap_mobile.MyWorkOrderOperation':
                type = 'OV';
                break;
            default:
                return Promise.reject(false);
        }
        let cachedConfigs = libCom.getStateVariable(context, 'DigitalSignatureConfigs');
        if (cachedConfigs && cachedConfigs[type]) {
            return Promise.resolve(cachedConfigs[type]);
        }
        var aPromises = [];
        aPromises.push(context.read('/SAPAssetManager/Services/AssetManager.service', 'DigitalSignatureObjectConfigs', [], "$expand=DigitalSignatureObject_Nav&$filter=ObjectType eq '" + type + "'"));
        aPromises.push(context.read('/SAPAssetManager/Services/AssetManager.service', 'DigitalSignatureTypes', [], ''));
        aPromises.push(context.read('/SAPAssetManager/Services/AssetManager.service', 'DigitalSignatureMethods', [], '$expand=DigitalSignatureStrategy_Nav'));
        return Promise.all(aPromises).then( results => {
            if (results) {
                if (results[0]) { // object config
                    configuration.ObjectConfig = results[0].getItem(0);
                }

                if (results[1] && results[1].length === 1) { // DigitalSignatureTypes
                    configuration.SignatureType = results[1].getItem(0).SignatureType;
                } else {
                    configuration.SignatureType = 'A'; // default
                }

                if (results[2] && results[2].length === 1) { // DigitalSignatureMethods
                    configuration.Method = results[2].getItem(0).Method;
                    if (results[2].getItem(0).DigitalSignatureStrategy_Nav && results[2].getItem(0).DigitalSignatureStrategy_Nav.length === 1) {
                        configuration.Strategy = results[2].getItem(0).DigitalSignatureStrategy_Nav[0].Strategy;
                    } else {
                        configuration.Strategy = 'TOTP_2E'; // default
                    }
                }
                if (!cachedConfigs) {
                    cachedConfigs = {};
                } 
                cachedConfigs[type] = configuration;

                libCom.setStateVariable(context, 'DigitalSignatureConfigs', cachedConfigs);
                return cachedConfigs[type];
           }
           return Promise.reject(false);
        }, () => {
            return Promise.reject(false);
        }).catch (()=> {
            return Promise.reject(false);
        });
    }

    static  validatePassphrase(context, control) {
        var passphraseText = context.evaluateTargetPath('#Control:passphrase/#Value');
    
        if (libVal.evalIsEmpty(passphraseText)) {
            // show inline error
            libCom.executeInlineControlError(context, control, context.localizeText('passphrase_is_mandatory'));
            return Promise.reject(false);
        }
        return Promise.resolve(true);
    }

    static checkPassphraseLength(context, control) {
        var passphraseText = context.evaluateTargetPath('#Control:passphrase/#Value');
    
        if (libVal.evalIsEmpty(passphraseText)) {
            // show inline error
            libCom.executeInlineControlError(context, control, context.localizeText('passphrase_is_mandatory'));
            return Promise.reject(false);
        } else {
            if (passphraseText.length < 4 || passphraseText.length > 6) {
                libCom.executeInlineControlError(context, control, context.localizeText('passphrase_length'));
                return Promise.reject(false);
            }
        }
        return Promise.resolve(true);
    }

    
    static validateRemark(context, control) {
        var remark = context.evaluateTargetPath('#Control:remark/#Value');
        return libThis.readConfiguration(context).then(config => {
            if (config) {
                let signatureObject = config.ObjectConfig;
                if (signatureObject && signatureObject.DigitalSignatureObject_Nav.AllowRemark === 'X' && libVal.evalIsEmpty(remark)) {
                    // show inline error
                    libCom.executeInlineControlError(context, control, context.localizeText('remark_is_mandatory'));
                    return Promise.reject(false);
                }
                return Promise.resolve(true);
            } 
            return Promise.resolve(false);
        });
    }

    
    static  validateComment(context, control) {
        var comment = context.evaluateTargetPath('#Control:comment/#Value');
        return libThis.readConfiguration(context).then(config =>{
            if (config) {
                let signatureObject = config.ObjectConfig;
                if (signatureObject && signatureObject.DigitalSignatureObject_Nav.AllowComment === 'X' && libVal.evalIsEmpty(comment)) {
                    // show inline error
                    libCom.executeInlineControlError(context, control, context.localizeText('comment_is_mandatory'));
                    return Promise.reject(false);
                }
                return Promise.resolve(true);
            }
            return Promise.resolve(false);
        });
    }


    static  validatePasscode(context, control) {
        var comment = context.evaluateTargetPath('#Control:comment/#Value');
        return libThis.readConfiguration(context).then(config =>{
            if (config) {
                let signatureObject = config.ObjectConfig;
                if (signatureObject.DigitalSignatureObject_Nav.AllowComment === 'X' && libVal.evalIsEmpty(comment)) {
                    // show inline error
                    libCom.executeInlineControlError(context, control, context.localizeText('comment_is_mandatory'));
                    return Promise.reject(false);
                }
                return Promise.resolve(true);
            }
            return Promise.resolve(false);
        });
    }

    ////Do a read on userpreference preferencegroup=TOTDevice and PreferenceName=DeviceGUID and check agains current device id from mdk api
    static IsCurrentDeviceDefaultDevice(context) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserPreferences', [], '$filter=PreferenceName eq \'DeviceGUID\'' )
        .then(userProfile => {
            if (libCom.isDefined(userProfile.getItem(0))) {
                return (userProfile.getItem(0).PreferenceValue === this.getDeviceId(context));
            } else {
                return false;
            }
         }).catch(() => {
            return false;
         });
    }

    static checkPasscodeLength(context, control) {
        var passcodeText = context.evaluateTargetPath('#Control:passcode/#Value');
    
        if (libVal.evalIsEmpty(passcodeText)) {
            // show inline error 
            libCom.executeInlineControlError(context, control, context.localizeText('passcode_is_mandatory'));
            return Promise.reject(false);
        } else {
            if (passcodeText.length < 6) {
                libCom.executeInlineControlError(context, control, context.localizeText('passcode_length'));
                return Promise.reject(false);
            }
        }
        return Promise.resolve(true);
    }

}
