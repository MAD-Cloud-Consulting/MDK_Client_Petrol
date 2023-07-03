
export default function IsWorkOrderSelected(context) {

    return context.getBindingObject().OrderID.length > 0;

}
