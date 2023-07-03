import {BusinessPartnerWrapper} from './BusinessPartnerWrapper';

export default function BusinessPartnerDescription(context) {
    let wrapper = new BusinessPartnerWrapper(context.getBindingObject());
    return wrapper.partnerDetails().Description;
}
