import DocumentCreateDelete from '../../Documents/Create/DocumentCreateDelete';
import { PartnerFunction } from '../../Common/Library/PartnerFunction';
import libCommon from '../../Common/Library/CommonLibrary';
import WorkOrderCreateUpdateGeometryPost from './WorkOrderCreateUpdateGeometryPost';

export default function WorkOrderUpdateOnSuccess(context) {
    if (context.binding.isServiceOrder) {
        let partnerFuncForSoldToParty = PartnerFunction.getSoldToPartyPartnerFunction();
        let currentSoldToPartyPartner = context.binding.WOPartners.find((partner) => {
            return partner.PartnerFunction === partnerFuncForSoldToParty;
        });

        let currentPartnerReadLink = currentSoldToPartyPartner && currentSoldToPartyPartner['@odata.readLink'];
        let currentPartnerID = currentSoldToPartyPartner && currentSoldToPartyPartner.Partner || '';

        let newPartnerID = libCommon.getControlValue(context.evaluateTargetPath('#Control:SoldToPartyLstPkr'));

        //Update the service order with select sold-to-party
        return updateSOPartner(context, currentPartnerReadLink, currentPartnerID, newPartnerID).then(() => {
            return updateAccountingIndicator(context).then(() => {
                return DocumentCreateDelete(context);
            });
        });
    }
    if (libCommon.getStateVariable(context, 'GeometryObjectType') === 'WorkOrder') {
        libCommon.setStateVariable(context, 'GeometryObjectType', '');
        return WorkOrderCreateUpdateGeometryPost(context).then(() => {
            return DocumentCreateDelete(context);
        });
    } else {
        return DocumentCreateDelete(context);
    }
}

function updateSOPartner(context, currentPartnerReadLink, currentPartnerID, newPartnerID) {
    if (newPartnerID === currentPartnerID) {
        return Promise.resolve();
    }

    //Create new WOPartner if no WOPartners with current PartnerFunction
    if (!currentPartnerReadLink && newPartnerID) {
        return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceOrderPartnerCreate.action');
    }

    context.binding.currentPartnerID = currentPartnerID;
    context.binding.soldToPartyPartnerReadLink = currentPartnerReadLink;

    //Delete WOPartner if sold-to-party was unselected
    if (!newPartnerID) {
        return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceOrderPartnerDelete.action');
    }

    return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceOrderPartnerUpdate.action');
}

function updateAccountingIndicator(context) {
    const accountingIndicator = libCommon.getTargetPathValue(context,'#Page:WorkOrderCreateUpdatePage/#Control:AccountIndicatorLstPkr/#SelectedValue');        
    context.binding.AccountingIndicator = accountingIndicator;
    if (libCommon.isDefined(context.binding.WOSales_Nav)) {
        context.binding.WOSales_Nav.AccountingIndicator = accountingIndicator;
    }
    return Promise.resolve();
}
