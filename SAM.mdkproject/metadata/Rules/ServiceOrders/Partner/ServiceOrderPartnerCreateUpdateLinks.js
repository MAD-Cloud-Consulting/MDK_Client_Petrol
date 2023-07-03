import workOrderPartnerCreateUpdateLinks from '../../WorkOrders/Partner/WorkOrderPartnerCreateUpdateLinks';
import libCommon from '../../Common/Library/CommonLibrary';
import {PartnerFunction} from '../../Common/Library/PartnerFunction';

export default function ServiceOrderPartnerCreateUpdateLinks(pageProxy) {
    let onCreate = libCommon.IsOnCreate(pageProxy);
    let links = [];
    if (onCreate) {
        links = workOrderPartnerCreateUpdateLinks(pageProxy);
    } else {
        let woLink = pageProxy.createLinkSpecifierProxy(
            'WorkOrderHeader', 
            'MyWorkOrderHeaders', 
            '',
            pageProxy.binding['@odata.readLink']
        );
        links.push(woLink.getSpecifier());
    }

    let link = pageProxy.createLinkSpecifierProxy(
        'PartnerFunction_Nav', 
        'PartnerFunctions', 
        '',
        `PartnerFunctions('${PartnerFunction.getSoldToPartyPartnerFunction()}')`
    );
    links.push(link.getSpecifier());

    let customerNumber = pageProxy.evaluateTargetPath('#Page:WorkOrderCreateUpdatePage/#Control:SoldToPartyLstPkr/#SelectedValue');

    return pageProxy.read('/SAPAssetManager/Services/AssetManager.service', `Customers('${customerNumber}')`, [], '$expand=Address_Nav').then((result) => {
        if (result.length < 1) {
            return links;
        }
        let customer = result.getItem(0);
        if (customer.Address_Nav) {
            link = pageProxy.createLinkSpecifierProxy(
                'Address_Nav',
                'Addresses',
                '',
                customer.Address_Nav['@odata.readLink']
            );
            links.push(link.getSpecifier());
        }
        return links;
    }).catch(() => {
        return links;
    });
}
