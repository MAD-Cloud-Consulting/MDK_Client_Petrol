import {BusinessPartnerWrapper} from './BusinessPartnerWrapper';

export default function BusinessPartnerState(context) {
    let wrapper = new BusinessPartnerWrapper(context.getBindingObject());
    let state = wrapper.addressProperty('Region');
    return state === undefined ? '' : state;
}
