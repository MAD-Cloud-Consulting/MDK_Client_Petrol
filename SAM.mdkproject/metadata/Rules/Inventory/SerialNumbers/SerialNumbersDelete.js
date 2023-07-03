import IsAndroid from '../../Common/IsAndroid';
import libCom from '../../Common/Library/CommonLibrary';
import SerialNumDisable from './SerialNumDisable';

export default function SerialNumbersDelete(context) {
    const objectType = libCom.getStateVariable(context, 'IMObjectType');
    const target = context.getPageProxy().getActionBinding();
    const serialNumbers = libCom.getStateVariable(context, 'SerialNumbers');
    const changedSerialNumbers = serialNumbers.actual.filter(
        (item) => item.SerialNumber !== target.SerialNumber
    );
    const quantityPicker = context
        .getPageProxy()
        .getControl('SectionedTable')
        .getControl('QuantityUOM');
    const quantityValue = quantityPicker.getValue().split(' ');
    const issueTransferRecipient =
        objectType === 'ADHOC' || objectType === 'TRF' || objectType === 'MAT';

    if (issueTransferRecipient) {
        quantityValue[0] = Number(quantityValue[0]) - 1;
    } else {
        quantityValue[0] = Number(quantityValue[0]) + 1;
        SerialNumDisable(context, quantityValue[0]);
    }

    quantityPicker.setValue(quantityValue.join(' '));
    libCom.setStateVariable(context, 'SerialNumbers', {
        actual: changedSerialNumbers,
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
