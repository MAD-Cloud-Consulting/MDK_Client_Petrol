import libCom from '../../Common/Library/CommonLibrary';
import SerialNumDisable from './SerialNumDisable';
import IsAndroid from '../../Common/IsAndroid';

export default function SerialNumbersSelected(context) {
    const objectType = libCom.getStateVariable(context, 'IMObjectType');
    const target = context.getPageProxy().getActionBinding();
    const serialNumbers = libCom.getStateVariable(context, 'SerialNumbers');
    const quantityPicker = context
        .getPageProxy()
        .getControl('SectionedTable')
        .getControl('QuantityUOM');
    const quantityValue = quantityPicker.getValue().split(' ');
    const issueTransferRecipient =
        objectType === 'ADHOC' || objectType === 'TRF' || objectType === 'MAT';

    if (!Number(quantityValue[0]) && !target.selected && !issueTransferRecipient || target.Description || target.new) {
        return null;
    }

    const actualNumbers = serialNumbers.actual.map((item) => {
        if (item.SerialNumber === target.SerialNumber) {
            item.selected = !item.selected;
            if (item.selected) {
                if (issueTransferRecipient) {
                    quantityValue[0] = Number(quantityValue[0]) + 1;
                } else quantityValue[0] = Number(quantityValue[0]) - 1;
            } else {
                if (issueTransferRecipient) {
                    quantityValue[0] = Number(quantityValue[0]) - 1;
                } else quantityValue[0] = Number(quantityValue[0]) + 1;
            }
        }

        return item;
    });

    if (!issueTransferRecipient) SerialNumDisable(context, quantityValue[0]);

    quantityPicker.setValue(quantityValue.join(' '));
    libCom.setStateVariable(context, 'SerialNumbers', {
        actual: actualNumbers,
        initial: serialNumbers.initial,
    });
    
    context
        .getPageProxy()
        .getControl('SectionedTable')
        .getSection(
            `${
                IsAndroid(context)
                    ? 'SerialNumbersObjectTableAndroid'
                    : 'SerialNumbersObjectTable'
            }`
        )
        .redraw();
}
