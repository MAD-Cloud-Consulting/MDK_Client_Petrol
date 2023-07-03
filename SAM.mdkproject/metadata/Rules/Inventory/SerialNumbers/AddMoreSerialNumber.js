import libCom from '../../Common/Library/CommonLibrary';
import SerialNumDisable from './SerialNumDisable';

export default function AddMoreSerialNumber(context) {
    const objectType = libCom.getStateVariable(context, 'IMObjectType');
    const serialPicker = context.getPageProxy().getControl('SectionedTable').getControl('SerialNum');
    const newSerialNumber = serialPicker.getValue();
    const quantityPicker = context.getPageProxy().getControl('SectionedTable').getControl('QuantityUOM');
    const quantityValue = quantityPicker.getValue().split(' ');
    const serialNumbers = libCom.getStateVariable(context, 'SerialNumbers');
    const actualNumbers = serialNumbers.actual || [];
    const existNumber = actualNumbers.find(item => item.SerialNumber === newSerialNumber);
    const issueTransferRecipient = objectType === 'ADHOC' || objectType === 'TRF' || objectType === 'MAT';

    if (!newSerialNumber) {
        return null;
    } 

    if (existNumber) {
        if (existNumber.selected || existNumber.Description) {
            serialPicker.setValue('');
            return null;
        } else {
            existNumber.selected = true;
        }
    } else {
        actualNumbers.push({
            SerialNumber: newSerialNumber,
            selected: true,
            new: true,
        });
    }

    if (issueTransferRecipient) {
        quantityValue[0] = Number(quantityValue[0]) + 1;
    } else {
        quantityValue[0] = Number(quantityValue[0]) - 1;
        SerialNumDisable(context, quantityValue[0]);
    }

    quantityPicker.setValue(quantityValue.join(' '));
    libCom.setStateVariable(context, 'SerialNumbers', {actual: actualNumbers, initial: serialNumbers.initial});
    serialPicker.setValue('');
    context.getPageProxy().getControl('SectionedTable').redraw();
}
