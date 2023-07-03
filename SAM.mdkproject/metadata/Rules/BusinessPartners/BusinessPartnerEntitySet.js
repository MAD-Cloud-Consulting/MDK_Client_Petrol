export default function BusinessPartnerEntitySet(context) {
    if (typeof context.getPageProxy === 'function') {
        context = context.getPageProxy();
    }

    //BP nav-link for work order is WOPartners
    let entitySet = context.binding['@odata.readLink'] + '/WOPartners';
    
    //BP nav-link for notification is Partners
    if (context.binding['@odata.type'] === '#sap_mobile.MyNotificationHeader') {
        entitySet = context.binding['@odata.readLink'] + '/Partners';
    }
    
    return entitySet;
}
