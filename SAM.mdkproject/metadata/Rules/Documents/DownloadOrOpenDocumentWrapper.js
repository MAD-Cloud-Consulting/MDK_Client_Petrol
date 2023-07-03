import DownloadOrOpenDocument from './DownloadOrOpenDocument';

export default function DownloadOrOpenDocumentWrapper(sectionedTableProxy) {
    return DownloadOrOpenDocument(sectionedTableProxy, 'Document');
}
