import DocumentPath from './DocumentPath';
import libVal from '../Common/Library/ValidationLibrary';
import libCommon from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';

export default function GetHTMLPath(sectionedTableProxy, documentObject) {
    let readLink = documentObject['@odata.readLink'];
    let serviceName = '/SAPAssetManager/Services/AssetManager.service';
    let entitySet = readLink.split('(')[0];
    const docDownloadID = 'DocDownload.' + documentObject.DocumentID;
    
    // Check if media already exists or needs to be downloaded
    return sectionedTableProxy.isMediaLocal(serviceName, entitySet, readLink).then((isMediaLocal) => {
        if (isMediaLocal && !libVal.evalIsEmpty(readLink)) {
            let documentPath = DocumentPath(sectionedTableProxy, documentObject);

            let writeError = undefined;
            let promise = Promise.resolve(documentPath);

            if (!sectionedTableProxy.nativescript.fileSystemModule.File.exists(documentPath)) {
                // action overwrite as getActionBinding method is undefined in MDK 6.1.1-ms-12-08
                promise = sectionedTableProxy.getPageProxy().executeAction({
                    'Name': '/SAPAssetManager/Actions/Documents/DownloadMedia.action', 'Properties': {
                        'Target': {
                            'EntitySet': 'Documents',
                            'ReadLink': readLink,
                            'Service': '/SAPAssetManager/Services/AssetManager.service',
                        },
                        'OnSuccess': '',
                    },
                }).then((content) => {
                    let documentFileObject = sectionedTableProxy.nativescript.fileSystemModule.File.fromPath(documentPath);
                    documentFileObject.writeSync(content.data, err => {
                        writeError = err;
                    });
                    let bindingItems = {
                        'attachment' : [{'content':content.data, 'contentType':documentObject.MimeType}],
                        'contentType': documentObject.MimeType,
                        'FileName': documentObject.FileName, 
                    };
                    libCommon.setStateVariable(sectionedTableProxy, 'attachmentProps', bindingItems);
                    libCommon.clearFromClientData(sectionedTableProxy, docDownloadID, undefined, true);
                    return documentPath;
                }).catch(err => {
                    Logger.error(err);
                    return Promise.reject(err);
                });
            }

            return promise.then(docPath => {
                if (writeError) {
                    return Promise.reject();
                }
                return Promise.resolve(docPath);
            }).catch(err => {
                Logger.error(err);
                return Promise.reject(err);
            });
        } else {
            return Promise.reject();
        }
    });
}
