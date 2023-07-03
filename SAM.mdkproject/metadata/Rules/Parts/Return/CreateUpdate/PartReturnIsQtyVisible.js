import isSerialized from '../../Issue/SerialParts/SerialPartsAreAllowed';

export default function PartReturnIsQtyVisible(context) {
    return !isSerialized(context);
}
