import libCom from '../../Common/Library/CommonLibrary';

export default function IsGoodsEditable(context) {
    const objectType = libCom.getStateVariable(context, 'IMObjectType');
    if (objectType === 'REV') {
        return false;
    }
    return true;
}
