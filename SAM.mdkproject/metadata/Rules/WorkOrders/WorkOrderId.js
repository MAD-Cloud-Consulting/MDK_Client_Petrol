export default function WorkOrderId(context) {
    let binding = context.getBindingObject();
    if (binding && binding.OrderId) {
        return binding.OrderId;
    }
    return '';
}
