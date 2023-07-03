export default function GetDeliveryComplete(context) {
    let type;
    
    if (context.binding) {
        type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        if (type === 'MaterialDocItem') {
            return (context.binding.FinalIssue === 'X' ? true: false);
        }
    }
    return false; //If not editing an existing local receipt item, then default to false
}
