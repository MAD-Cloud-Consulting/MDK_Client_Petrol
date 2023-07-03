import libVal from '../../Common/Library/ValidationLibrary';

export default function InspectionLotTitle(context) {
    let binding = context.getBindingObject();
    let id = ' (' + binding.InspectionLot + ')';

    if (libVal.evalIsEmpty(binding.InspectionLot_Nav.ShortDesc)) {
        return '-' + id;
    }
    return binding.InspectionLot_Nav.ShortDesc + id;
}
