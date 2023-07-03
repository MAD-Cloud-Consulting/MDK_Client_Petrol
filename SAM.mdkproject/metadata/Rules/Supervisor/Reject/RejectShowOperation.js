export default function RejectShowOperation(context) {
    
    let businessObject = context.binding;

    if (businessObject['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
        return true;
    }
    return false;
}
