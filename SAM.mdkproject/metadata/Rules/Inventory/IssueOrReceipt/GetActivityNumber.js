export default function GetActivityNumber(context) {
    let type;
    
    if (context.binding) { 
        type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        if (type === 'MaterialDocItem') {
            return context.binding.NetworkActivity;
        } else if (type === 'ReservationItem') {
            return context.binding.ActivityNum;
        }
    }
    return '';
}
