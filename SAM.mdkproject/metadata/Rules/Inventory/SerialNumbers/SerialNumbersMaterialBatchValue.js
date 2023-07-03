import libCom from '../../Common/Library/CommonLibrary';
import EnableFieldServiceTechnician from '../../SideDrawer/EnableFieldServiceTechnician';

export default function MaterialBatchValue(context) {
    const page =  libCom.getPreviousPageName(context);
    const isVehicle = (page === 'VehicleIssueOrReceiptCreatePage' || page === 'StockListViewPage' || page === 'StockDetailsPage' || page === 'MaterialDocumentDetails') && EnableFieldServiceTechnician(context);
    const objectType = libCom.getStateVariable(context, 'IMObjectType');
    const createdBinding = libCom.getStateVariable(context, 'SerialPageBinding');
    const target = (!isVehicle && context.binding) || createdBinding;
    const type = context.binding ? context.binding['@odata.type'].substring('#sap_mobile.'.length) : '';
    const stockType = 'StockTransportOrderItem';
    const purchaseType = 'PurchaseOrderItem';
    const reservType = 'ReservationItem';

    let material = target.MaterialNum || target.Material || '';
    let batch = '';
    let bin = '';

    if (objectType === 'ADHOC' || objectType === 'MAT' || type === purchaseType || type === stockType || type === reservType || type.includes('DeliveryItem') || type === 'MaterialDocItem') {
        batch = createdBinding.Batch;
        bin = createdBinding.StorageBin;
    } else if (!isVehicle) {
        batch = target.Batch;
        bin = target.MaterialSLoc_Nav && target.MaterialSLoc_Nav.StorageBin || target.StorageBin;
    }

    if (isVehicle) {
        return material;
    }
    
    if (material && bin && batch) {
        return material + '/' + bin + '/' + batch;
    } else if (material && batch) {
        return material + '/' + batch;
    } else if (material && bin) {
        return material + '/' + bin;
    } else if (material) {
        return material;
    }
}
