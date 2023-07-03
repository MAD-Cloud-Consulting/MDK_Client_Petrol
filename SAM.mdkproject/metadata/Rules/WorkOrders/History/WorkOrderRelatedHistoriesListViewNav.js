import libCommon from '../../Common/Library/CommonLibrary';

export default function WorkOrderRelatedHistoriesListViewNav(sectionProxy) {
    let binding = sectionProxy.getPageProxy().binding;
    let odataType = binding['@odata.type'];

    if (odataType === '#sap_mobile.MyWorkOrderHeader') {
        return libCommon.navigateOnRead(sectionProxy.getPageProxy(), 
            '/SAPAssetManager/Actions/WorkOrders/WorkOrderRelatedHistoriesListViewNav.action', 
            binding['@odata.readLink'], 
            '$expand=RelatedWOHistory');
    } else {
        if (binding.WorkOrderHeader[0]) {
            return libCommon.navigateOnRead(sectionProxy.getPageProxy(), 
            '/SAPAssetManager/Actions/WorkOrders/WorkOrderRelatedHistoriesListViewNav.action', 
            binding.WorkOrderHeader[0]['@odata.readLink'], 
            '$expand=RelatedWOHistory');
        }
        return sectionProxy.getPageProxy().executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderRelatedHistoriesListViewNav.action');
    }
}
