import DocumentFileSize from '../../../Documents/DocumentFileSize';

export default function PRTDocumentFileSizeWrapper(sectionProxy) {
    return DocumentFileSize(sectionProxy, sectionProxy.binding.PRTDocument);
}
