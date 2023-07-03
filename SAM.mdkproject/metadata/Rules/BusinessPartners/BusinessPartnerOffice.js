import {BusinessPartnerWrapper} from './BusinessPartnerWrapper';
import {ValueIfExists} from '../Common/Library/Formatter';

export default function BusinessPartnerOffice(context) {
    let wrapper = new BusinessPartnerWrapper(context.getBindingObject());
    let office = wrapper.office(context);
    return ValueIfExists(office);
}
