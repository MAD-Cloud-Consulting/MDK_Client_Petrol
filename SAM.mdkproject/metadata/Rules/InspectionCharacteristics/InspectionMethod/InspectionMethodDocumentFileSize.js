import getFileSize from '../../Documents/DocumentFileSize';

export default function InspectionMethodDocumentFileSize(sectionProxy) {
    return getFileSize(sectionProxy, sectionProxy.binding.InspectionMethod_Nav.Document_Nav);
}
