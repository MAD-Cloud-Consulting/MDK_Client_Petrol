import serialItem from '../../Validation/ShowAutoSerialNumberField';
import libCom from '../../../Common/Library/CommonLibrary';

export default function PhysicalInventoryCountUpdateOnReturning(context) {
    
    let quantity = libCom.getControlProxy(context, 'QuantitySimple');
    let zero = libCom.getControlProxy(context, 'ZeroCountSwitch');
    let material = libCom.getControlProxy(context, 'MatrialListPicker');
    
    return serialItem(context).then(function(serialized) { //Check if serialized material
        if (serialized) {
            let serialMap = libCom.getStateVariable(context, 'NewSerialMap');
            if (serialMap && serialMap.size) {
                quantity.setValue(serialMap.size); //Set the quantity to number of serial numbers in cache
                zero.setEditable(false); //Cannot set to zero count with serial numbers in cache
                zero.setValue(false);
                if (material) {
                    material.setEditable(false);
                }
            } else {
                zero.setEditable(true);
                quantity.setValue('0');
                if (material) {
                    material.setEditable(true);
                }
            }
        }
    });
}
