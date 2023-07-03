import getIndicator from '../../Documents/SetIndicatorState';

export default function InspectionMethodDocumentSetIndicatorState(sectionProxy) {
    let binding = sectionProxy.binding;

    if (binding.Document_Nav) {
        binding.Document = binding.Document_Nav;
        return getIndicator(sectionProxy, '#Property:Document_Nav/#Property:@odata.readLink');
    } else {
        return '-';
    }

}
