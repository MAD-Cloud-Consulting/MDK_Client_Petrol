import libVal from '../Common/Library/ValidationLibrary';
import libCom from '../Common/Library/CommonLibrary';

/**
* * Creates the nav-links when a new object list record is added.
* @param {IClientAPI} context
*/
export default function ObjectListCreateLinksNotifFromWorkOrder(context) {
    var links = [];
    
    let woHeaderNavReadLink = undefined;
    let notifHeaderNavReadLink = undefined;

    let bindingObj = context.binding;
    if (!libVal.evalIsEmpty(bindingObj)) {
        let orderId = bindingObj.OrderId;
        if (bindingObj['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
            woHeaderNavReadLink = "MyWorkOrderHeaders('" + orderId + "')";
        } 
    }
    let localNotificationID = libCom.getStateVariable(context, 'LocalId');
    notifHeaderNavReadLink = "MyNotificationHeaders('" + localNotificationID + "')";

   
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
