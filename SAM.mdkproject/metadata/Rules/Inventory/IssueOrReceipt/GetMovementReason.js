export default function GetMovementReason(context) {
    let type;

    if (context.binding) {
        type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        if (type === 'MaterialDocItem') {
            return context.binding.MovementReason;
        }
    }
    return ''; //If not editing an existing local receipt item, then default to empty
}
