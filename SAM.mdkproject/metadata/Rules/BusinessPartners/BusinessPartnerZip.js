import {BusinessPartnerWrapper} from './BusinessPartnerWrapper';

export default function BusinessPartnerZip(context) {
    let wrapper = new BusinessPartnerWrapper(context.getBindingObject());
    let zip = wrapper.addressProperty('PostalCode');
    return zip === undefined ? '' : zip;
}
