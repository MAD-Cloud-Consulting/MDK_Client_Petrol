import getMaterialDocItemsListQuery from '../PurchaseOrder/GetMaterialDocItemsListQuery';

export default function GetMaterialDocItemsReversalQuery(context) {
    return getMaterialDocItemsListQuery(context, true);
}
