export default function GetBusinessArea(context) {
    let type;
    
    if (context.binding) { 
        type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        if (type === 'MaterialDocItem') {
            //
        } else if (type === 'ReservationItem') {
            return context.binding.BusinessArea;
        }
    }
    return '';
}
