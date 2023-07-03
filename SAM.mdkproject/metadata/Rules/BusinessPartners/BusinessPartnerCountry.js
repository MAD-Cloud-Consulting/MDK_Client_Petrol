import {BusinessPartnerWrapper} from './BusinessPartnerWrapper';

export default function BusinessPartnerCountry(context) {
    let wrapper = new BusinessPartnerWrapper(context.getBindingObject());
    let country = wrapper.addressProperty('Country');
    return country === null ? '' : country; 
}
