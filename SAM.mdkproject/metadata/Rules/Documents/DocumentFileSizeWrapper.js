import DocumentFileSize from './DocumentFileSize';

export default function DocumentFileSizeWrapper(sectionProxy) {
    return DocumentFileSize(sectionProxy, sectionProxy.binding.Document);
}
