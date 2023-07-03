import NavOnCompleteWorkOrderPage from '../NavOnCompleteWorkOrderPage';
import libCommon from '../../Common/Library/CommonLibrary';

export default function WorkOrderCompleteFromWOListSwipe(context, binding) {
    let pageName = libCommon.getPageName(context);
    libCommon.setStateVariable(context, 'contextMenuSwipePage', pageName);
    
    libCommon.setBindingObject(context);

    return NavOnCompleteWorkOrderPage(context, binding);
}
