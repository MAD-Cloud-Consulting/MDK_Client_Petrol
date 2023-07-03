
import lamIsVisible from './LAMIsVisible';

export default function LAMVisible(context) {

    let binding = context.binding;
    let filter = '';

    let odataType = binding['@odata.type'];
    if (odataType === '#sap_mobile.MyWorkOrderHeader') {
        filter = "$filter=ObjectType eq 'OR'";
    }
    
    return lamIsVisible(context, binding['@odata.readLink'], [], filter);

}
