import getFileName from '../../Documents/DocumentFileName';

export default function InspectionMethodDocumentFileName(context) {

    let binding = context.binding.InspectionMethod_Nav;

    if (binding.Document_Nav) {
        binding.Document = binding.Document_Nav;
        return getFileName(context);
    } else {
        return '-';
    }
}
