
export default function IsOperationChangable(context) {
    let binding = context.getBindingObject();
    // Returns true if the Operation is Changable and a Work Order is selected
    return binding.IsOperationChangable && context.getBindingObject().OrderID.length > 0;
    
}
