import libCom from '../../Common/Library/CommonLibrary';

export default function PhysicalInventoryDocItemsQueryOptions(context) {
    let PhysicalInventoryDocId = libCom.getStateVariable(context, 'PhysicalInventoryLocalId');
    return `$filter=PhysInvDoc eq '${PhysicalInventoryDocId}'&$expand=MaterialSLoc_Nav`;
}
