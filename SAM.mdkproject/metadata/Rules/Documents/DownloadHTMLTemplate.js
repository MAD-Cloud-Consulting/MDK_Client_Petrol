import libVal from '../Common/Library/ValidationLibrary';
import libCommon from '../Common/Library/CommonLibrary';

export default function DownloadHTMLTemplate(pageProxy) {
    let serviceName = '/SAPAssetManager/Services/AssetManager.service';
    return pageProxy.read(serviceName, 'ReportTemplates', [], '$expand=Document_Nav').then((document) => {
        if (!libVal.evalIsEmpty(document.getItem(0))) {
            let documentObject = document.getItem(0).Document_Nav;
            let readLink = documentObject['@odata.readLink'];
            libCommon.setStateVariable(pageProxy, 'ReportTemplate', document.getItem(0));

            const docDownloadID = 'DocDownload.' + documentObject.DocumentID;
            let entitySet = readLink.split('(')[0];

            return pageProxy.isMediaLocal(serviceName, entitySet, readLink).then((isMediaLocal) => {
                if (!isMediaLocal) {
                    return pageProxy.executeAction('/SAPAssetManager/Actions/Documents/DownloadDocumentStreams.action')
                        .then((result) => {
                            if (result.data && result.data.search(/error/i)) {
                                libCommon.clearFromClientData(pageProxy, docDownloadID, undefined, true);
                                return pageProxy.executeAction('/SAPAssetManager/Actions/Documents/DownloadDocumentStreamsFailure.action');
                            }
                            return Promise.resolve();
                        }, () => {
                            libCommon.clearFromClientData(pageProxy, docDownloadID, undefined, true);
                            return pageProxy.executeAction('/SAPAssetManager/Actions/Documents/DownloadDocumentStreamsFailure.action');
                    });
                }
                return Promise.resolve();
            });
        }
        return Promise.resolve();
    }); 
}
