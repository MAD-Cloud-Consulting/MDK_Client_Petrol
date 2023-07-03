import {BusinessPartnerWrapper} from './BusinessPartnerWrapper';
import libEval from '../Common/Library/ValidationLibrary';

export default function BusinessPartnerFaxExtension(context) {
    let wrapper = new BusinessPartnerWrapper(context.getBindingObject());
    let extension = wrapper.communicationProperty('FaxExtension');
    return libEval.evalIsEmpty(extension) ? '' : extension;   
}
