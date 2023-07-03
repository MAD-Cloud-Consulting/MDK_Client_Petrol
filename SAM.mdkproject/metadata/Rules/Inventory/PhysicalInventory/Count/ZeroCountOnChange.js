import libCom from '../../../Common/Library/CommonLibrary';
import showAuto from '../../Validation/ShowAutoSerialNumberField';

export default function ZeroCountOnChange(context) {

    let pageProxy = context.getPageProxy();

    let quantity = libCom.getControlProxy(pageProxy, 'QuantitySimple');
    let zero = libCom.getControlProxy(pageProxy, 'ZeroCountSwitch');
    let serial = libCom.getControlProxy(pageProxy, 'SerialNumberAdd');
    
    return showAuto(context).then(function(show) { //Check if serialized material
        if (zero.getValue()) {
            quantity.setValue('0');
            quantity.setEditable(false);
            quantity.clearValidation();
            if (show) {
                serial.setVisible(false);
            }
        } else {
            quantity.setEditable(!show);
            if (show) {
                serial.setVisible(true);
            } else {
                serial.setVisible(false);
            }
        }
    });
}
