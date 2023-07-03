import libCommon from '../../Common/Library/CommonLibrary';
import NavOnCompleteSubOperationPage from './NavOnCompleteSubOperationPage';

export default function SubOperationCompleteFromListSwipe(context, binding) {
    let pageName = libCommon.getPageName(context);
    libCommon.setStateVariable(context, 'contextMenuSwipePage', pageName);
    
    libCommon.setBindingObject(context);

    return NavOnCompleteSubOperationPage(context, binding);
}
