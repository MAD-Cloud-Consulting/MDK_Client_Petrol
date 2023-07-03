import {BusinessPartnerWrapper} from './BusinessPartnerWrapper';
import libCom from '../Common/Library/CommonLibrary';
import libEval from '../Common/Library/ValidationLibrary';

export default function BusinessPartnerFax(context) {
    let pageName = libCom.getPageName(context);
    let wrapper = new BusinessPartnerWrapper(context.getBindingObject());
    let isOnEditPage = pageName === 'BusinessPartnerEditPage';
    let faxLong = wrapper.communicationProperty('Fax');
    let faxShort = wrapper.communicationProperty('FaxShort');
    let faxExtension = wrapper.communicationProperty('FaxExtension');
    let fax = '';


    if (isOnEditPage) {
        fax = faxShort;
    } else {
        fax = faxLong;
    }

    if (!libEval.evalIsEmpty(faxExtension) && !isOnEditPage) {
        let ext_idx = faxLong.length - faxExtension.length;
        if (ext_idx > 0) {
            fax = faxLong.substring(0, ext_idx);
        }
    }


    let emptyVal = pageName === 'BusinessPartnerEditPage' ? '' : '-';
    if (libEval.evalIsEmpty(faxLong)) return emptyVal;

    if (!isOnEditPage && !libEval.evalIsEmpty(faxExtension)) {
        fax = context.localizeText('telephone_w_ext', [fax, faxExtension]);
    }
    return fax;  
}
