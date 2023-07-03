import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';

export default function EnableRecordResults(context) {
    let enableResults = false;
    if (context.binding['@odata.type'] === '#sap_mobile.InspectionLot') {
        if (context.binding.InspectionChars_Nav.length > 0) {
            enableResults = true;
        }
    } else if (context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
        if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Checklist.global').getValue()) && context.binding.EAMChecklist_Nav && context.binding.EAMChecklist_Nav.length > 0 ) {
            enableResults = true; 
        }
        if (context.binding.InspectionPoint_Nav.length > 0) {
            enableResults = true;
        } 
    } else if (context.binding['@odata.type'] === '#sap_mobile.InspectionPoint') {
        if (context.binding.InspectionChar_Nav.length > 0) {
            enableResults = true;
        }
    } else if (context.binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
        enableResults = true;
    }

    let woHeaderLink = context.binding['@odata.readLink'];
    let woHeaderBinding = context.binding['@odata.readLink'];
    if (context.binding.hasOwnProperty('InspectionLot_Nav') && context.binding.InspectionLot_Nav.hasOwnProperty('WOHeader_Nav')) {
        woHeaderLink = context.binding.InspectionLot_Nav.WOHeader_Nav['@odata.readLink'];
        woHeaderBinding = context.binding.InspectionLot_Nav.WOHeader_Nav;
    } else if (context.binding.hasOwnProperty('WOOperation_Nav') && context.binding.WOOperation_Nav.hasOwnProperty('WOHeader')) {
        woHeaderLink = context.binding.WOOperation_Nav.WOHeader['@odata.readLink'];
        woHeaderBinding = context.binding.WOOperation_Nav.WOHeader;
    } else if (context.binding.hasOwnProperty('WOHeader')) {
        woHeaderLink = context.binding.WOHeader['@odata.readLink'];
        woHeaderBinding = context.binding.WOHeader;
    } else if (context.binding.hasOwnProperty('WOHeader_Nav')) {
        woHeaderLink = context.binding.WOHeader_Nav['@odata.readLink'];
        woHeaderBinding = context.binding.WOHeader_Nav;
    }

    if (enableResults) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', woHeaderLink, [],'$expand=InspectionLot_Nav').then(function(result) {
            if (result && result.length > 0 && result.getItem(0).InspectionLot_Nav) {
                let inspectionLots = result.getItem(0).InspectionLot_Nav;
                let availableInpections = false;
                inspectionLots.forEach(function(element) {
                    if ((libVal.evalIsEmpty(element.UDCode) || element['@sap.isLocal'])) {
                        availableInpections = true;
                    }
                });
                return (availableInpections) ? checkStatus(context, woHeaderBinding, woHeaderLink): availableInpections;
            } else {
                return false;
            }
        });
    } else {
        return Promise.resolve(false);
    }
}

export function checkStatus(context, woHeaderBinding, woHeaderLink) {
    switch (libCom.getWorkOrderAssnTypeLevel(context)) {
        case 'Header':
            // Header level: Check the OrderMobileStatus, and return the resolved Promise.
            if (woHeaderBinding.OrderMobileStatus_Nav.MobileStatus === 'STARTED') {
                return Promise.resolve(true);
            } else {
                return Promise.resolve(false);
            }
        case 'Operation':
            // Operation Level: Get a count of all of the Operations whose OperationMobileStatus is 'STARTED'. If count > 0, return true.
            return context.count('/SAPAssetManager/Services/AssetManager.service', woHeaderLink + '/Operations', "$filter=OperationMobileStatus_Nav/MobileStatus eq 'STARTED'").then(function(count) {
                return (count > 0);
            });
        case 'SubOperation':
                // Suboperation Level: Get a count of all of the Operations who have a Sub-Operation whose SuboperationMobileStatus is 'STARTED'. If count > 0, return true.
            return context.count('/SAPAssetManager/Services/AssetManager.service', woHeaderLink + '/Operations', "$filter=SubOperations/any(subop : subop/SubOpMobileStatus_Nav/MobileStatus eq 'STARTED')").then(function(count) {
                return (count > 0);
            });
        default:
            return false;
    }
}
