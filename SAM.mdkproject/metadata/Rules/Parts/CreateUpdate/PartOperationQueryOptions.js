export default function PartOperationQueryOptions(context) {
    if (!context) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    if (!context.binding) {
        throw new TypeError('Binding can\'t be null or undefined');
    }
    let binding = context.binding;
    let query = "$orderby=OperationNo,OperationShortText&$filter=OrderId eq '" + binding.OrderId + "'";
    return query;
}
