import libCom from '../../../Common/Library/CommonLibrary';

export default function GetZeroCountPostValue(context) {
    return libCom.getControlProxy(context,'ZeroCountSwitch').getValue() === true ? 'X': '';
}


