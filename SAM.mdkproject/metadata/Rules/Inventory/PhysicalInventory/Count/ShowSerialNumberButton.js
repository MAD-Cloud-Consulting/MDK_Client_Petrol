import showAuto from '../../Validation/ShowAutoSerialNumberField';

export default function ShowSerialNumberButton(context) {

    let zero = context.binding.ZeroCount;

    return showAuto(context).then(function(show) { //Check if serialized material
        if (zero) { //If zero count slider is true, do not allow serial numbers to be added
            return false;
        } else {
            return show;
        }
    });
}
