import libCommon from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';
import libMobile from '../MobileStatus/MobileStatusLibrary';
import isAndroid from '../Common/IsAndroid';

export default function SubOperationsListViewIconImages(pageProxy) {
    var iconImage = [];
    if (libCommon.getTargetPathValue(pageProxy,'#Property:@sap.isLocal')) {
        iconImage.push(isAndroid(pageProxy) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
    }

    let binding = pageProxy.getBindingObject();

    if (binding && binding.SubOperationNo && libMobile.isSubOperationStatusChangeable()) { //check mobile status only if suboperation level assignment
        return libMobile.mobileStatus(pageProxy, pageProxy.binding).then(function(result) {
            if (result === 'COMPLETED') {
                iconImage.push('/SAPAssetManager/Images/stepCheckmarkIcon.png');
            }
            return iconImage;
        }).catch(err => {
            /**Implementing our Logger class*/
            Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySubOperations.global').getValue(), 'SUBJOBSTEPS',err);
        });
    } else { //check system status
        return libMobile.isMobileStatusConfirmed(pageProxy, binding.SubOperationNo).then(function(result) {
            if (result) {
                iconImage.push('/SAPAssetManager/Images/stepCheckmarkIcon.png');
            }
            return iconImage;
        }).catch(err => {
            /**Implementing our Logger class*/
            Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySubOperations.global').getValue(), 'SUBJOBSTEPS',err);
        });
    }
    
}
