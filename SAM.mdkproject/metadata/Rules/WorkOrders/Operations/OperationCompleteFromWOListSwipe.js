import libCommon from '../../Common/Library/CommonLibrary';
import NavOnCompleteOperationPage from './NavOnCompleteOperationPage';

export default function OperationCompleteFromWOListSwipe(context, binding) {
    let pageName = libCommon.getPageName(context);
    libCommon.setStateVariable(context, 'contextMenuSwipePage', pageName);
    
    libCommon.setBindingObject(context);

    return NavOnCompleteOperationPage(context, binding);
}
