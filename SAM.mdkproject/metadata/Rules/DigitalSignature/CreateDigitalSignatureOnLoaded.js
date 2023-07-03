/**
* Describe this function...
* @param {IClientAPI} context
*/

import libDigSig from '../DigitalSignature/DigitalSignatureLibrary';
import Logger from '../Log/Logger';


export default function CreateDigitalSignatureOnLoaded(context) {
    return context.executeAction('/SAPAssetManager/Actions/OData/DigitalSignature/CreateOnlineDigitalSignatureService.action').then(() => {
        return libDigSig.readConfiguration(context).then(config => {
            let signatureObject = config.ObjectConfig;
            if (!signatureObject || signatureObject.DigitalSignatureObject_Nav.AllowRemark === 'V') {
                // hide contorl
                let control = context.evaluateTargetPath('#Control:remark');
                control.setVisible(false);
            }
            if (!signatureObject || signatureObject.DigitalSignatureObject_Nav.AllowComment === 'V') {
                // hide contorl
                let control = context.evaluateTargetPath('#Control:comment');
                control.setVisible(false);
            }
        }).catch(() => {
            // log error
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDigitalSignature/DigitalSignature.global').getValue(), 'Error reading digital signature configuraiton');
        }); 
    });
}
