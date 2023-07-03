
import getDocumentType from '../../Documents/DocumentTypeIcon';

export default function InspectionMethodDocumentTypeImage(context) {
    let binding = context.binding;

    if (binding.Document_Nav) {
        binding.Document = binding.Document_Nav;
        return getDocumentType(context);
    } else {
        return '-';
    }

}
