/**
* Create all the documents with correct extensions
* @param {Icontext} context
*/
import documentLinksOnUpdate from './DocumentCreateBDSLink';
import libVal from '../../Common/Library/ValidationLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import documentLinksOnCreate from '../Create/DocumentOnCreateLink';
export default function DocumentCreateBDS(context, attachmentList='') {
    let documentCreateAction = '';
    if (libVal.evalIsEmpty(attachmentList)) {
        // Get the cell with attachment
        let pageName = libCom.getPageName(context);
        let attachmentCtrl = context.evaluateTargetPath('#Page:'+pageName+'/#Control:Attachment');
        // Get attachment list
        attachmentList = attachmentCtrl.getClientData().AddedAttachments;
    }
    
    let documentResult = Promise.resolve();
    libCom.setStateVariable(context, 'uploadedCount', 0);
    libCom.setStateVariable(context, 'mediaReadLinks', []);
     if (libCom.IsOnCreate(context)) {
        documentCreateAction = '/SAPAssetManager/Actions/Documents/DocumentOnCreate.action';
    } else {
        documentCreateAction = '/SAPAssetManager/Actions/Documents/DocumentCreateBDS.action';
    }
    attachmentList.forEach(attachment => {
        documentResult = documentResult.then(() => {
            let contentType = attachment.contentType.split('/');
            let mimeType = contentType[1];
            let fullFileName = attachment.urlString;
            let fileName = fullFileName.split('/').pop();
            if (fileName.indexOf('.') < 0) {
                fileName = fileName + '.' + mimeType;
            }
            let bindingItems = {
                'attachment': [attachment],
                'contentType': mimeType,
                'FileName': fileName, 
            };
            return setBindingOnParent(context,attachmentList.length, bindingItems, documentCreateAction);
        });
    });
    return documentResult;
        
}
function setBindingOnParent(context, totalDocuments,item, documentCreateAction) {
    libCom.setStateVariable(context, 'attachmentProps', item);
    let uploadedCount = libCom.getStateVariable(context, 'uploadedCount');
    let mediaReadLinks = libCom.getStateVariable(context, 'mediaReadLinks');
    return context.executeAction(documentCreateAction).then((data) => {
        uploadedCount++;
        mediaReadLinks.push(data.data[0]);
        libCom.setStateVariable(context, 'uploadedCount', uploadedCount);
        libCom.setStateVariable(context, 'mediaReadLinks', mediaReadLinks);
        if (uploadedCount === totalDocuments) {
            // if all attachments have been uploaded, then try to run onSuccess in DocumentCreateBDS.action before
            context._context.clientData.mediaReadLinks = mediaReadLinks;
            if (libCom.IsOnCreate(context)) {
                return documentLinksOnCreate(context);
            } else {
                return documentLinksOnUpdate(context);
            }
        }
        return '';
    });
}
