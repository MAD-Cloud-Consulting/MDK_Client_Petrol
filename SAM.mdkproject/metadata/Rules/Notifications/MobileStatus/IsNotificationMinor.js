import libVal from '../../Common/Library/ValidationLibrary';
import Logger from '../../Log/Logger';

export default function IsNotificationMinor(context, mobileStatus) {
    if (mobileStatus) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MobileStatusMappings', [], `$filter=ObjectType eq 'NOTIFICATION' and MobileStatus eq '${mobileStatus}'`).then(mapping => {
            return libVal.evalIsEmpty(mapping.getItem(0).StatusAttribute1);
        }).catch((error) => {
            Logger.info('Error reading MobileStatusMappings, defaulting minor switch to false' + error);
            return false;
        }); 
    } else {
        return false;
    }
   
}
