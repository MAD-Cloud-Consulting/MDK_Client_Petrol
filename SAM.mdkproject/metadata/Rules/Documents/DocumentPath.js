import DocumentID from './DocumentID';
import Logger from '../Log/Logger';
import NativeScriptObject from '../Common/Library/NativeScriptObject';

export default function DocumentPath(context, documentObject) {
    let documentID = DocumentID(documentObject);
    let filename = documentObject.FileName;
    let tempFolder = NativeScriptObject.getNativeScriptObject(context).fileSystemModule.knownFolders.temp();
    if (filename && documentID) {
        return NativeScriptObject.getNativeScriptObject(context).fileSystemModule.path.join(tempFolder.path, documentID, filename);
    } else {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDocuments.global').getValue(), 'Document ID or file name does not exist');
        return '';
    }
  
}
