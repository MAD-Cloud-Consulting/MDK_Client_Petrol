import libCom from '../../../Common/Library/CommonLibrary';

export default function GetSerialDeleteReadLink(context) {

    return libCom.getStateVariable(context, 'TempSerial_ReadLink');

}
