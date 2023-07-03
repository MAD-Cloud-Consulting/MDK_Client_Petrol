export default function ValuationStyle(context) {
    switch (context.binding.Valuation) {
        case 'A':
            return 'AcceptedGreen';
        case 'R':
        case 'F':
            return 'RejectedRed';
        default:
            return 'GrayText';
    }
}
