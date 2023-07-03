export default function InspectionLotValuationStyle(context) {
    let binding = context.getBindingObject();
    let status = binding.InspectionLot_Nav.ValuationStatus;

    switch (status) {
        case 'A':
            return 'AcceptedGreen';
        case 'R':
        case 'F':
            return 'RejectedRed';
        default:
            return '';
    }
}
