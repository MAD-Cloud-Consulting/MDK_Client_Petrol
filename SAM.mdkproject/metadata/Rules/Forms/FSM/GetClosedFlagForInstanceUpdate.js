import libCom from '../../Common/Library/CommonLibrary';

export default function GetClosedFlagForInstanceUpdate(context) {
    return libCom.getStateVariable(context, 'FSMClosedFlag');
}
