import libCom from '../../../Common/Library/CommonLibrary';

export default function GetSerialNumberDrunfCreate(context) {

    return libCom.getStateVariable(context, 'TempSerial_SerialNumber');

}
