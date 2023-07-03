import libCom from '../../Common/Library/CommonLibrary';

export default function SerialNumbersCaption(context) {
    const serialNumbers = libCom.getStateVariable(context, 'SerialNumbers').actual;

    if (!serialNumbers || !serialNumbers.length) {
        return context.localizeText('serial_numbers');
    } else {
        const confirmed = serialNumbers.filter(item => item.selected).length;
        const total = serialNumbers.length;

        return context.localizeText('serial_numbers_x_x', [confirmed, total]);
    }
}
