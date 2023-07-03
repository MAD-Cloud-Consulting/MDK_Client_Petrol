import libCom from '../Common/Library/CommonLibrary';

export default function DocumentDateEditable(context) {
    let objectType = libCom.getStateVariable(context, 'IMObjectType');
    if (objectType === 'ADHOC' || objectType === 'REV') {
        return false;
    }
    return true;
}
