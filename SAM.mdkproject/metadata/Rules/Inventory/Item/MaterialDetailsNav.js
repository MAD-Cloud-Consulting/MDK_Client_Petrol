import libCom from '../../Common/Library/CommonLibrary';
import EnableInventoryClerk from '../../SideDrawer/EnableInventoryClerk';
import EnableMultipleTechnician from '../../SideDrawer/EnableMultipleTechnician';

export default function MaterialDetailsNav(context) {
    let item = context.getPageProxy().getClientData().item || context.binding;
    let MatDocItemQuery = '';
    if (item) {
        MatDocItemQuery =  ` and MatDocItem eq '${item.MatDocItem}'`;
    } else {
        item = context.getPageProxy().getActionBinding();
        MatDocItemQuery = '';
        libCom.removeStateVariable(context, 'ClosePageCount');
    }

    if (EnableMultipleTechnician(context) && libCom.getPreviousPageName(context) === 'StockListViewPage') {
        libCom.setStateVariable(context, 'Temp_MaterialDocumentReadLink', item['@odata.readLink']);
        libCom.setStateVariable(context, 'Temp_MaterialDocumentNumber', item.MaterialDocNumber);
        let expand = '$expand=AssociatedMaterialDoc,PurchaseOrder_Nav,STO_Nav,ProductionOrderItem_Nav,ProductionOrderComponent_Nav,Reservation_Nav';
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialDocItems', [], `$filter=MaterialDocNumber eq '${item.MaterialDocNumber}'${MatDocItemQuery}&${expand}`).then(data => {
            context.getPageProxy().setActionBinding(data.getItem(0));
            return context.executeAction('/SAPAssetManager/Actions/Inventory/MaterialDocument/MaterialDocumentDetailsNav.action');
        });
    }

    if (EnableInventoryClerk(context)) {
        let expand = '$expand=RelatedItem/PurchaseOrder_Nav,RelatedItem/STO_Nav,RelatedItem/ProductionOrderItem_Nav,RelatedItem/ProductionOrderComponent_Nav,RelatedItem/Reservation_Nav';
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialDocuments', [], `$filter=MaterialDocNumber eq '${item.MaterialDocNumber}'&${expand}`).then(data => {
            context.getPageProxy().setActionBinding(data.getItem(0));
            return context.executeAction('/SAPAssetManager/Actions/Inventory/MaterialDocument/MaterialDocumentDetailsIMNav.action');
        });
    }
    
   
}
