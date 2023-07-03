import {BusinessPartnerWrapper} from './BusinessPartnerWrapper';

export default function BusinessPartnerCity(context) {
    let wrapper = new BusinessPartnerWrapper(context.getBindingObject());
    let city = wrapper.addressProperty('City');
    return city === null ? '' : city;
}
