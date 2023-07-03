import DocumentPath from '../DocumentPath';
import Logger from '../../Log/Logger';
import libCommon from '../../Common/Library/CommonLibrary';
import NativeScriptObject from '../../Common/Library/NativeScriptObject';

export default function DocumentSave(context, documentObject) {
    if (documentObject) {
        var documentPath = DocumentPath(context, documentObject);
        var documentFileObject = NativeScriptObject.getNativeScriptObject(context).fileSystemModule.File.fromPath(documentPath);
        let content = context.getClientData()[documentObject['@odata.readLink']];
        documentFileObject.writeSync(content, () => {
            return context.executeAction('/SAPAssetManager/Actions/Documents/DownloadMediaFailure.action');
        });
        const docDownloadID = 'DocDownload.' + documentObject.DocumentID;
        libCommon.clearFromClientData(context, docDownloadID, undefined, true);
    } else {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDocuments.global').getValue(), 'Cannot write document');
    }
  
}
