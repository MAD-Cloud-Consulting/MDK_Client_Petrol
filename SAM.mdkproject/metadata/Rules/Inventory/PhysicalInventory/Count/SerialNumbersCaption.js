import libCom from '../../../Common/Library/CommonLibrary';

export default function SerialNumbersCaption(context) {
   
    let serialMap = libCom.getStateVariable(context, 'NewSerialMap');
    if (serialMap.size) {
        return context.localizeText('serial_serial_numbers') + ' (' + serialMap.size + ')';
    }
    return '';
}
