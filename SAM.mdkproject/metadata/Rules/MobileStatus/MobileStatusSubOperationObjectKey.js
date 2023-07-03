/**
 * 
 * @param {*} context 
 */
export default function MobileStatusSubOperationObjectKey(context) {
    //The sub-operation object
    let binding = context.binding;
    var objectKey = '';
    //If not a local sub-operation, it will have an ObjectKey value
    if (binding.ObjectKey) {
        objectKey = binding.ObjectKey;
    } else if (binding.SubOpMobileStatus_Nav.ObjectKey) {
        //For local sub-operations, we get the local ObjectKey from PMMobileStatuses record.
        objectKey = binding.SubOpMobileStatus_Nav.ObjectKey;
    }
    return objectKey;
}
