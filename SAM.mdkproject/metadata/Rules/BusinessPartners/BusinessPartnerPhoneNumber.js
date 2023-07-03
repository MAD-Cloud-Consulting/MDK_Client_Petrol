import IsAddressCommType from './IsAddressCommType';
import { BusinessPartnerWrapper } from './BusinessPartnerWrapper';
import ValidationLibrary from '../Common/Library/ValidationLibrary';
import libCom from '../Common/Library/CommonLibrary';
import libEval from '../Common/Library/ValidationLibrary';


/**
 * Retrieves either the Telephone number or Mobile number if available. Telephone preferred
 * @param {Context} context - calling context
 */
export default function BusinessPartnerPhoneNumber(context, isCallable=false) {
    let pageName = libCom.getPageName(context);

    let wrapper = new BusinessPartnerWrapper(context.getBindingObject());
    let teleType = (IsAddressCommType(context) && isCallable) ? 'CallableTelephone' : 'Telephone';
    let phoneNumber = wrapper.communicationProperty(teleType);
        
    if (ValidationLibrary.evalIsEmpty(phoneNumber)) {
        phoneNumber = wrapper.communicationProperty('Mobile');
    }
    let emptyVal = pageName === 'BusinessPartnerDetailsPage' ? '-' : '';
    return libEval.evalIsEmpty(phoneNumber) ? emptyVal : phoneNumber;       
}
