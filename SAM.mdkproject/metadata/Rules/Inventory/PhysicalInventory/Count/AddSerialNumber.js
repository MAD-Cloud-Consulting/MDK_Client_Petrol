import libCom from '../../../Common/Library/CommonLibrary';

export default function AddSerialNumber(context) {

    const serialControl = context.getPageProxy().getControl('SectionedTable').getControl('SerialNum');
    let value = serialControl.getValue();
    if (value) {
        let serialMap = libCom.getStateVariable(context, 'NewSerialMap');
        if (!serialMap.has(value)) { //Serial not already in the list
            let serial = {};
            
            serial.SerialNumber = value;
            serial.Date = new Date();
            serial.IsLocal = true;
            serial.IsNew = true;
            serialMap.set(value, serial);

            context.getPageProxy().getControl('SectionedTable').redraw(); //redraw the serial list with the new item
        }
        serialControl.setValue('');
    }
}
