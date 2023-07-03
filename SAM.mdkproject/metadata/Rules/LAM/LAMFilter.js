export default function LAMFilter(context) {

    let binding = context.binding;
    let filter = '';

    let odataType = binding['@odata.type'];

    switch (odataType) {
        case '#sap_mobile.MyWorkOrderHeader':
            filter = "$filter=ObjectType eq 'OR'";
            break;
        case '#sap_mobile.MyFunctionalLocatiom':
            filter = "$filter=ObjectType eq 'IF'";
            break;
        case '#sap_mobile.MyNotificationHeader':
            filter = "$filter=ObjectType eq 'QM'";
            break;
        default:
            break;

    }

    return filter;
}
