import libCommon from '../Common/Library/CommonLibrary';
import Validate from '../Common/Library/ValidationLibrary';
/**
* Get the correct Mobile Status Object
* @param {IClientAPI} context
*/
export default function SignatureControlMobileStatus(context) {
    let bindingObj = context.getClientData().currentObject;
    let currentInstance = context.getClientData().currentInstance;
    if (Validate.evalIsEmpty(context.getClientData().currentInstance)) {
        currentInstance = context.getClientData().currentObject.WorkOrderHeader.currentInstance;
        bindingObj = context.getClientData().currentObject.WorkOrderHeader;
    }
    let mobileStatusObject = '';
    //This is the object for which we want to update the mobile status to "complete".
    let mobileInstance = '';
    if (bindingObj) {
        switch (currentInstance.entitySet()) {
            case 'MyWorkOrderHeaders': {
                switch (bindingObj['@odata.type']) {
                    case '#sap_mobile.MyWorkOrderHeader': {
                        mobileStatusObject = bindingObj.OrderMobileStatus_Nav;
                        mobileInstance = bindingObj;
                        break;
                    }
                    case '#sap_mobile.MyWorkOrderOperation': {
                        mobileStatusObject = bindingObj.WOHeader.OrderMobileStatus_Nav;
                        mobileInstance = bindingObj.WOHeader;
                        break;
                    }
                    case '#sap_mobile.MyWorkOrderSubOperation': {
                        mobileStatusObject = bindingObj.WorkOrderOperation.WOHeader.OrderMobileStatus_Nav;
                        mobileInstance = bindingObj.WorkOrderOperation.WOHeader;
                        break;
                    }
                    default:
                        break;
                }
                break;
            }
            case 'MyWorkOrderOperations': {
                switch (bindingObj['@odata.type']) {
                    case '#sap_mobile.MyWorkOrderOperation': {
                        mobileStatusObject = bindingObj.OperationMobileStatus_Nav;
                        mobileInstance = bindingObj;
                        break;
                    }
                    case '#sap_mobile.MyWorkOrderSubOperation': {
                        mobileStatusObject = bindingObj.WorkOrderOperation.OperationMobileStatus_Nav;
                        mobileInstance = bindingObj.WorkOrderOperation;
                        break;
                    }
                    default:
                        break;
                }
                break;
            }
            case 'MyWorkOrderSubOperations': {
                switch (bindingObj['@odata.type']) {
                    case '#sap_mobile.MyWorkOrderSubOperation': {
                        mobileStatusObject = bindingObj.SubOpMobileStatus_Nav;
                        break;
                    }
                    default:
                        break;
                }
                break;
            }
            default:
                break;
        }
    }

    if (libCommon.isDefined(mobileStatusObject)) {
        //Needed for MobileStatusSetComplete.action.
        context.getClientData().MobileStatusReadLink = mobileStatusObject['@odata.readLink'];
        context.getClientData().MobileStatusObjectKey = mobileStatusObject.ObjectKey;
        context.getClientData().MobileStatusObjectType = mobileStatusObject.ObjectType;
        //Needed for EndDateTime.js which is called in MobileStatusSetComplete.action.
        context.getClientData().MobileStatusInstance = mobileInstance;
    }
}
