import {BusinessPartnerWrapper} from './BusinessPartnerWrapper';
import libEval from '../Common/Library/ValidationLibrary';

export default function BusinessPartnerAddress(context) {
    let wrapper = new BusinessPartnerWrapper(context.getBindingObject());
    let address = wrapper.address();
    return libEval.evalIsEmpty(address) ? '-' : address;
}
