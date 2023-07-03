import libCom from '../../Common/Library/CommonLibrary';

export default function SaveSerialNumbers(context) {
    const actualNumbers = libCom.getStateVariable(context, 'SerialNumbers').actual;
    libCom.setStateVariable(context, 'SerialNumbers', {actual: actualNumbers, initial: JSON.parse(JSON.stringify(actualNumbers))});
    return context.executeAction('/SAPAssetManager/Actions/Inventory/SerialNumbers/SerialNumberCloseModal.action');
}
