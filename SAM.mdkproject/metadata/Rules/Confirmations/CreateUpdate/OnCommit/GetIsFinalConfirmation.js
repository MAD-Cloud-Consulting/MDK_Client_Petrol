import libCom from '../../../Common/Library/CommonLibrary';

export default function GetIsFinalConfirmation(context) {

    let isFinalConfirmation = libCom.getControlProxy(context,'IsFinalConfirmation').getValue();

    return isFinalConfirmation ? 'X': '';
}
