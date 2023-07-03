import isSerial from '../../Validation/IsMaterialSerializedDuringCreate';
import libCom from '../../../Common/Library/CommonLibrary';

export default function ShowSerialNumberButtonDuringCreate(context) {

    let zero = false;

    if (!libCom.IsOnCreate(context)) {
        zero = context.binding.ZeroCount === 'X' ? true: false;
    }

    return isSerial(context).then(function(serial) { //Check if serialized material
        if (zero) { //If zero count slider is true, do not allow serial numbers to be added
            return false;
        } else {
            return serial;
        }
    });
}
