import {ValueIfExists} from '../../Common/Library/Formatter';

export default function InspectionLotDetailsPlant(context) {
    return ValueIfExists(context.binding.Plant);
}
