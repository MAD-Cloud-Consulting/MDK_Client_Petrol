import {BusinessPartnerWrapper} from './BusinessPartnerWrapper';

export default function BusinessPartnerStreet(context) {
    let wrapper = new BusinessPartnerWrapper(context.getBindingObject());
    let street = wrapper.addressProperty('Street');
    return street === undefined ? '' : street;
}
