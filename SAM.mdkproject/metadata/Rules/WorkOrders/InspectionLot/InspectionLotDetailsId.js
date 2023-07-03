import {ValueIfExists} from '../../Common/Library/Formatter';

export default function InspectionLotDetailsId(context) {
    let binding = context.getBindingObject();
    return ValueIfExists(binding.InspectionLot);
}
