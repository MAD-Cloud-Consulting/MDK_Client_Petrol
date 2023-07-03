import {BusinessPartnerWrapper} from './BusinessPartnerWrapper';
import libEval from '../Common/Library/ValidationLibrary';

export default function BusinessPartnerTeleExtension(context) {
    let wrapper = new BusinessPartnerWrapper(context.getBindingObject());
    let extension = wrapper.communicationProperty('Extension');
    return libEval.evalIsEmpty(extension) ? '' : extension;   
}
