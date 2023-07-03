
export default function WorkOrderObjectKey(context) {
    var woObjectKey = '';
    //Context.binding is the WorkOrder object.
    if (context.binding.ObjectKey) {
        //Existing orders will have the ObjectKey populated.
        woObjectKey = context.binding.ObjectKey;
    } else if (context.binding.OrderMobileStatus_Nav.ObjectKey) {
        //local orders will have the ObjectKey populated in the OrderMobileStatus_Nav object.
        woObjectKey = context.binding.OrderMobileStatus_Nav.ObjectKey;
    }
    return woObjectKey;
}
