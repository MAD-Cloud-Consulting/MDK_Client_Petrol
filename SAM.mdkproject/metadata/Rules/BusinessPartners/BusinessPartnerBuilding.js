import {BusinessPartnerWrapper} from './BusinessPartnerWrapper';
import libEval from '../Common/Library/ValidationLibrary';
import libCom from '../Common/Library/CommonLibrary';

export default function BusinessPartnerBuilding(context) {
    let wrapper = new BusinessPartnerWrapper(context.getBindingObject());
    let building = wrapper.addressProperty('Building');
    if (libEval.evalIsEmpty(building)) {
        let pageName = libCom.getPageName(context);
        return pageName === 'BusinessPartnerEditPage' ? '' : '-';
    }
    return building;
}
