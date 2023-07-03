import {BusinessPartnerWrapper} from './BusinessPartnerWrapper';

export default function BusinessPartnerFloor(context) {
    let wrapper = new BusinessPartnerWrapper(context.getBindingObject());
    let floor = wrapper.addressProperty('Floor');
    return floor === null? '' : floor;
}
