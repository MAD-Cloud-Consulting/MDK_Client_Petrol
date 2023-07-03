import libCom from '../../Common/Library/CommonLibrary';

export default function IssueOrReceiptCreateUpdateOnReturning(context) {
    const serialNumbers = libCom.getStateVariable(context, 'SerialNumbers');
    const SerialNumbersChanged = serialNumbers.actual.filter(item => item.selected).length - serialNumbers.initial.filter(item => item.selected).length;
    const objectType = libCom.getStateVariable(context, 'IMObjectType');

    if (SerialNumbersChanged !== 0) {
        return context.executeAction('/SAPAssetManager/Actions/Inventory/SerialNumbers/SerialNumberCancel.action').then(result => {
            if (result.data) {
                return libCom.getPageName(context) === 'VehicleIssueOrReceiptCreatePage' ? UpdateVehiclePage(context) : UpdatePage(context);
            } else {
                const openQuantity = libCom.getStateVariable(context, 'OpenQuantity');
                if (objectType === 'ADHOC' || objectType === 'TRF' || objectType === 'MAT') {
                    libCom.setStateVariable(context, 'OpenQuantity', serialNumbers.actual.filter(item => item.selected).length);
                } else {
                    libCom.setStateVariable(context, 'OpenQuantity', openQuantity - SerialNumbersChanged);
                }
                return context.executeAction('/SAPAssetManager/Actions/Inventory/SerialNumbers/SerialNumber.action');
            }
        });
    } else {
        return libCom.getPageName(context) === 'VehicleIssueOrReceiptCreatePage' ? UpdateVehiclePage(context) : UpdatePage(context);
    }
}

function UpdateVehiclePage(context) {
    const initialNumbers = libCom.getStateVariable(context, 'SerialNumbers').initial;
    const openQuantityPicker = libCom.getControlProxy(context, 'QuantitySimple');
    const newValue = initialNumbers.filter(item => item.selected).length;
    openQuantityPicker.setValue(newValue);
    libCom.setStateVariable(context, 'SerialNumbers', {actual: initialNumbers, initial: JSON.parse(JSON.stringify(initialNumbers))});
}

function UpdatePage(context) {
    const type = context.binding && context.binding['@odata.type'].substring('#sap_mobile.'.length);
    const objectType = libCom.getStateVariable(context, 'IMObjectType');
    const initialNumbers = libCom.getStateVariable(context, 'SerialNumbers').initial;
    const confirmedQuantityPicker = libCom.getControlProxy(context,'ConfirmedQuantitySimple');
    const openQuantityPicker = libCom.getControlProxy(context, 'QuantitySimple');
    const orderedQuantityValue = Number(libCom.getControlProxy(context, 'RequestedQuantitySimple').getValue().split(' ')[0]);
    const confirmedValue = String(confirmedQuantityPicker.getValue()).split(' ');
    const newValue = initialNumbers.filter(item => item.selected).length;

    if (objectType === 'STO' || objectType === 'PO' || objectType === 'RES' || objectType === 'PRD' || objectType === 'REV') {
        if (type === 'MaterialDocItem') {
            confirmedValue[0] = libCom.getStateVariable(context, 'ConfirmedFilled') + newValue - context.binding.SerialNum.length;
        } else if (libCom.getStateVariable(context, 'ConfirmedFilled')) {
            confirmedValue[0] = libCom.getStateVariable(context, 'ConfirmedFilled') + newValue;
        } else {
            confirmedValue[0] = newValue;
        }

        openQuantityPicker.setValue(orderedQuantityValue - confirmedValue[0]);
        libCom.setStateVariable(context, 'OpenQuantity', orderedQuantityValue - confirmedValue[0]);
    } 
    
    if (objectType === 'ADHOC' || objectType === 'TRF' || objectType === 'MAT') {
        openQuantityPicker.setValue(newValue);
    }

    if ( objectType === 'IB' || objectType === 'OB') {
        confirmedValue[0] = newValue;
    }
    
    confirmedValue[0] = String(confirmedValue[0]);
    confirmedQuantityPicker.setValue(confirmedValue.join(' '));
    
    libCom.setStateVariable(context, 'SerialNumbers', {actual: initialNumbers, initial: JSON.parse(JSON.stringify(initialNumbers))});
}
