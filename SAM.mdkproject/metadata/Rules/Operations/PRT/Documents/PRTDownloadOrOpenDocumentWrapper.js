import DownloadOrOpenDocument from '../../../Documents/DownloadOrOpenDocument';

export default function PRTDownloadOrOpenDocumentWrapper(sectionedTableProxy) {
    return DownloadOrOpenDocument(sectionedTableProxy, 'PRTDocument');
}
