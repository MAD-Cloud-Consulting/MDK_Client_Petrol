import libCom from '../../Common/Library/CommonLibrary';

export default function GetInstanceUpdateToastMessage(context) {
    return libCom.getStateVariable(context, 'FSMToastMessage');
}
