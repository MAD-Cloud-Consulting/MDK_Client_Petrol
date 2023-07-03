export default function GetGLAccount(context) {
    let type;
    
    if (context.binding) {
        type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        if (type === 'MaterialDocItem') {
            return context.binding.GLAccount;
        } else if (type === 'ReservationItem') {
            return context.binding.GLAccount;
        }
    }
    return '';
}
