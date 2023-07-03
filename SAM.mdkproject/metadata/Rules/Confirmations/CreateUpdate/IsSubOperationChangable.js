

export default function IsSubOperationChangable(context) {
    let binding = context.getBindingObject();
    // Returns true if the SubOperation is Changable and Operation is selected
    return binding.IsSubOperationChangable && context.getBindingObject().Operation.length > 0;
}
