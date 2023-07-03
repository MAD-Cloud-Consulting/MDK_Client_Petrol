import libCommon from '../Common/Library/CommonLibrary';
import ODataDate from '../Common/Date/ODataDate';
import OffsetODataDate from '../Common/Date/OffsetODataDate';
import libMobile from '../MobileStatus/MobileStatusLibrary';
import libVal from '../Common/Library/ValidationLibrary';

export default function EndDateTime(context) {
    if (typeof context.getPageProxy === 'function') {
        context = context.getPageProxy();
    }
    let bindingObj = context.binding;
    let readLink = '';
    let type = '';
    let link = '';

    /**
     * Set the correct bindingObj here.
     * If you create a labor PM confirmation from ConfirmationsOverviewListView.page, the bindingObj will be mConfirmation.
     * mConfirmation is our madeup object which we shouldn't be using but it's too complex to break now.
     * mConfirmation contains MyWorkOrderHeader inside it, in a property called WorkOrderHeader.
     * Here we are just setting bindingObj to be MyWorkOrderHeader from mConfirmation.WorkOrderHeader.
     */
    if (!libVal.evalIsEmpty(bindingObj) && bindingObj.hasOwnProperty('name') && bindingObj.name === 'mConfirmation') {
        bindingObj = libMobile.getWorkOrderHeaderObjFromConfirmationObj(context);
    } else if (!libVal.evalIsEmpty(context.getClientData().MobileStatusInstance)) {
        bindingObj = context.getClientData().MobileStatusInstance;
    } else if (!libVal.evalIsEmpty(context.getClientData().currentObject)) { // We have WorkOrderHeader object from currentObject but we also have Mobile Status so go directly to else
        bindingObj = context.getClientData().currentObject;
    } else if (!libVal.evalIsEmpty(context.evaluateTargetPath('#Page:-Previous/#ClientData').currentObject)) {
        bindingObj = context.evaluateTargetPath('#Page:-Previous/#ClientData').currentObject;
    }

    if (bindingObj.hasOwnProperty('@odata.readLink')) {
        readLink = bindingObj['@odata.readLink'];
        type = bindingObj['@odata.type'];
    } else {
        readLink = libCommon.GetBindingObject(context)['@odata.readLink'];
        type = libCommon.GetBindingObject(context)['@odata.type'];
    }
    
    if (type === '#sap_mobile.MyWorkOrderHeader') {
        link = '/OrderMobileStatus_Nav';
    } else if (type === '#sap_mobile.MyWorkOrderOperation') {
        link = '/OperationMobileStatus_Nav';
    } else if (type === '#sap_mobile.MyWorkOrderSubOperation') {
        link = '/SubOpMobileStatus_Nav';
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', readLink + link, [], '').then(function(results) {
        let odataDate;
        if (results && results.getItem(0)) {
            var status = results.getItem(0);
            if (status) {
                odataDate = OffsetODataDate(context, status.EffectiveTimestamp);
                libCommon.setStateVariable(context, 'StatusStartDate', odataDate.date());
            }
        }
        odataDate = new ODataDate();
        libCommon.setStateVariable(context, 'StatusEndDate', odataDate.date());
        return odataDate.toDBDateTimeString(context);
    });
}

