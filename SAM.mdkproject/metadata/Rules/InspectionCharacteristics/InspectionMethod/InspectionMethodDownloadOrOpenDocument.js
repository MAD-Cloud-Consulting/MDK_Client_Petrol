import downloadOrOpen from '../../Documents/DownloadOrOpenDocument';

export default function InspectionMethodDownloadOrOpenDocument(sectionedTableProxy) {
    return downloadOrOpen(sectionedTableProxy, 'Document_Nav');
}
