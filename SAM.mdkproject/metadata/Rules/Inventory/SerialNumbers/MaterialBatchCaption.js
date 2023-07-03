import libCom from '../../Common/Library/CommonLibrary';
import EnableFieldServiceTechnician from '../../SideDrawer/EnableFieldServiceTechnician';

/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function MaterialBatchCaption(clientAPI) {
    const page = libCom.getPreviousPageName(clientAPI);
    const isVehicle = (page === 'VehicleIssueOrReceiptCreatePage' || page === 'StockListViewPage' || page === 'StockDetailsPage' || page === 'MaterialDocumentDetails') && EnableFieldServiceTechnician(clientAPI);
    return isVehicle ? '$(L,material)' : '$(L,material_bin_batch)';
}
