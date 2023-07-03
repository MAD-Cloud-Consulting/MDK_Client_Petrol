
export default function RejectReasonCaption(context) {
    
    let businessObject = context.binding;

    if (businessObject['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
        return '$(L,reject_workorder)';
    } else if (businessObject['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
        return '$(L,reject_operation)';
    }
    return '';
}
