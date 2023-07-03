import libCom from '../../Common/Library/CommonLibrary';

export default function LAMConfirmationReadLink(context) {
    
    return libCom.getStateVariable(context, 'LAMConfirmationReadLink');
    
}
