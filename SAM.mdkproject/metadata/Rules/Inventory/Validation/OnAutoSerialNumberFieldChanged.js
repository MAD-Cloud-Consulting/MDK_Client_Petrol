import libCom from '../../Common/Library/CommonLibrary';
import GetReceivedQuantity from '../IssueOrReceipt/GetReceivedQuantity';
import GetConfirmedQuantity from '../IssueOrReceipt/GetConfirmedQuantity';

export default function OnAutoSerialNumberFieldChanged(context) {
    const objectType = libCom.getStateVariable(context, 'IMObjectType');
    const control = context.getPageProxy().getControl('FormCellContainer');
    const type = context.binding && context.binding['@odata.type'].substring('#sap_mobile.'.length);

    if (context.getValue()) {
        control.getControl('SerialPageNav').setVisible(false);
        control.getControl('QuantitySimple').setEditable(true);

        if (objectType === 'ADHOC') {
            if (type === 'MaterialDocItem') {
                if (context.binding.SerialNum.length) {
                    control.getControl('QuantitySimple').setValue(0);
                } else {
                    control.getControl('QuantitySimple').setValue(GetReceivedQuantity(context));
                }
            } else {
                control.getControl('QuantitySimple').setValue(0);
            }
        } else if (type === 'MaterialDocItem' && context.binding.SerialNum.length) {
            const confirmed = GetConfirmedQuantity(context).split(' ');
            const open = GetReceivedQuantity(context);
            confirmed[0] = Number(confirmed[0]) - context.binding.EntryQuantity;
            control.getControl('QuantitySimple').setValue(Number(open) + context.binding.EntryQuantity);
            control.getControl('ConfirmedQuantitySimple').setValue(confirmed.join(' '));
        } else {
            control.getControl('QuantitySimple').setValue(GetReceivedQuantity(context));
            control.getControl('ConfirmedQuantitySimple').setValue(GetConfirmedQuantity(context));
        }
    } else {
        control.getControl('SerialPageNav').setVisible(true);
        control.getControl('QuantitySimple').setEditable(false);

        if (objectType === 'ADHOC') {
            if (type === 'MaterialDocItem') {
                if (context.binding.SerialNum.length) {
                    control.getControl('QuantitySimple').setValue(context.binding.SerialNum.length);
                } else {
                    control.getControl('QuantitySimple').setValue(0);
                }
            } else {
                control.getControl('QuantitySimple').setValue(0);
            }
            
        } else if (context.binding.AutoGenerateSerialNumbers) {
            const confirmed = GetConfirmedQuantity(context).split(' ');
            confirmed[0] = Number(confirmed[0]) - context.binding.EntryQuantity; 
            control.getControl('ConfirmedQuantitySimple').setValue(confirmed.join(' '));
            control.getControl('QuantitySimple').setValue(GetReceivedQuantity(context));
            libCom.setStateVariable(context, 'ConfirmedFilled', confirmed[0]);
            libCom.setStateVariable(context, 'OpenQuantity', GetReceivedQuantity(context));
        } else {
            control.getControl('QuantitySimple').setValue(GetReceivedQuantity(context));
            control.getControl('ConfirmedQuantitySimple').setValue(GetConfirmedQuantity(context));
            libCom.setStateVariable(context, 'OpenQuantity', GetReceivedQuantity(context));
        }
    }

    libCom.setStateVariable(context, 'SerialNumbers', {actual: null, initial: null});
    return true;
}
