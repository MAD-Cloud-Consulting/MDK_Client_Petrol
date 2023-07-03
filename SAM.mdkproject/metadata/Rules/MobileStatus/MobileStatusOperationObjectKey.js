/**
 * 
 * @param {*} context 
 */
export default function MobileStatusOperationObjectKey(context) {
    //The operation object
    let binding = context.binding;
    var objectKey = '';
    //If not a local operation, it will have an ObjectKey value
    if (binding.ObjectKey) {
        objectKey = binding.ObjectKey;
    } else if (binding.OperationMobileStatus_Nav.ObjectKey) {
        //For local operations, we get the local ObjectKey from PMMobileStatuses record.
        objectKey = binding.OperationMobileStatus_Nav.ObjectKey;
    }
    return objectKey;
}
