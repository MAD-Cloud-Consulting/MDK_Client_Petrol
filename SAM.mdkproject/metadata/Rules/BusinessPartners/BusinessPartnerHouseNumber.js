import { BusinessPartnerWrapper } from './BusinessPartnerWrapper';

export default function BusinessPartnerHouseNumber(context) {
    let wrapper = new BusinessPartnerWrapper(context.getBindingObject());
    let houseNum = wrapper.addressProperty('House');
    return houseNum === null ? '' : houseNum;
}
