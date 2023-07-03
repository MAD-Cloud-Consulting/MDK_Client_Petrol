import libVal from '../Common/Library/ValidationLibrary';
import libCom from '../Common/Library/CommonLibrary';

/**
* Creates the nav-links when a new object list record is added.
* @param {IClientAPI} context
*/
export default function ObjectListCreateLinksNotifFromOperation(context) {
    var links = [];
    
    let woOperationNavReadLink = undefined;
    let woSubOperationNavReadLink = undefined;
    let woHeaderNavReadLink = undefined;
    let notifHeaderNavReadLink = undefined;

    let bindingObj = context.binding;
    if (!libVal.evalIsEmpty(bindingObj)) {
        let orderId = bindingObj.OrderId;
        if (bindingObj['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
            woHeaderNavReadLink = "MyWorkOrderHeaders('" + orderId + "')";
            woOperationNavReadLink = bindingObj['@odata.readLink'];
        } else if (bindingObj['@odata.type'] === '#sap_mobile.MyWorkOrderSubOperation') {
            let operationNo = bindingObj.OperationNo;
            woHeaderNavReadLink = "MyWorkOrderHeaders('" + orderId + "')";
            woOperationNavReadLink = "MyWorkOrderOperations(OrderId='" + orderId + "',OperationNo='" + operationNo + "')";
            woSubOperationNavReadLink = bindingObj['@odata.readLink'];
        }
    }
    let localNotificationID = libCom.getStateVariable(context, 'LocalId');
    notifHeaderNavReadLink = "MyNotificationHeaders('" + localNotificationID + "')";

    if (!libVal.evalIsEmpty(woOperationNavReadLink)) {
        links.push({
            'Property': 'WOOperation_Nav',
            'Target': {
                'EntitySet': 'MyWorkOrderOperations',
                'ReadLink': woOperationNavReadLink,
            },
        });
    }

    if (!libVal.evalIsEmpty(woSubOperationNavReadLink)) {
        links.push({
            'Property': 'WOSubOperation_Nav',
            'Target': {
                'EntitySet': 'MyWorkOrderSubOperations',
                'ReadLink': woSubOperationNavReadLink,
            },
        });
    }

    if (!libVal.evalIsEmpty(woHeaderNavReadLink)) {
        links.push({
            'Property': 'WOHeader_Nav',
            'Target': {
                'EntitySet': 'MyWorkOrderHeaders',
                'ReadLink': woHeaderNavReadLink,
            },
        });
    }

    if (!libVal.evalIsEmpty(notifHeaderNavReadLink)) {
        links.push({
            'Property': 'NotifHeader_Nav',
            'Target': {
                'EntitySet': 'MyNotificationHeaders',
                'ReadLink': notifHeaderNavReadLink,
            },
        });
    }

    return links;
}
