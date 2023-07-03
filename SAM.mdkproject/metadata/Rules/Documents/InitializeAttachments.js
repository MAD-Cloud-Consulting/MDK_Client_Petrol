import DocumentPath from './DocumentPath';
import DocLib from './DocumentLibrary';
import Logger from '../Log/Logger';

export default function InitializeAttachments(formcellProxy) {
    let serviceName = '/SAPAssetManager/Services/AssetManager.service';
    let objectDetails = DocLib.getDocumentObjectDetail(formcellProxy);
    let promises = [];
    let attachmentData = [];
    if (objectDetails.length) {
        return formcellProxy.read(serviceName, objectDetails[0].entitySet, [], objectDetails[0].queryOption).then(attachments => {
            attachments.forEach(attachmentObject => {
                let documentObject = attachmentObject.Document;
                let readLink = documentObject['@odata.readLink'];
                let entitySet = readLink.split('(')[0];
                promises.push(formcellProxy.isMediaLocal(serviceName, entitySet, readLink).then((isMediaLocal) => {
                    return [isMediaLocal, documentObject];
                }));
            });

            return Promise.all(promises).then(results => {
                results.forEach((result) => {
                    const isMedialLocal = result[0];
                    const attachment = result[1];
                    if (isMedialLocal && !attachment.FileSize) {
                        const entitySet = 'Documents';
                        const property = 'Document';
                        const readLink = attachment['@odata.readLink'];
                        const service = '/SAPAssetManager/Services/AssetManager.service';
                        const documentPath = DocumentPath(formcellProxy, attachment);
                        let attachmentEntry = formcellProxy.createAttachmentEntry(documentPath, entitySet, property, readLink, service);
                        if (attachmentEntry) {
                            attachmentData.push(attachmentEntry);
                        }
                    }
                });

                return attachmentData;
            });
        });
    } else {
        Logger.error(formcellProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDocuments.global').getValue(), 'Cannot find parent object type');
    }
}
