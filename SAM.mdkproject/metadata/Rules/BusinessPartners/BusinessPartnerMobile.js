import {BusinessPartnerWrapper} from './BusinessPartnerWrapper';
import libCom from '../Common/Library/CommonLibrary';
import libEval from '../Common/Library/ValidationLibrary';

export default function BusinessPartnerMobile(context) {
    let pageName = libCom.getPageName(context);
    let isOnEditPage = pageName === 'BusinessPartnerEditPage';
    let wrapper = new BusinessPartnerWrapper(context.getBindingObject());
    let mobile = '';
    if (isOnEditPage) {
        mobile = wrapper.communicationProperty('MobileShort');
    } else {
        mobile = wrapper.communicationProperty('Mobile');
    }
    let emptyVal = pageName === 'BusinessPartnerDetailsPage' ? '-' : '';
    return libEval.evalIsEmpty(mobile) ? emptyVal : mobile;       
}
