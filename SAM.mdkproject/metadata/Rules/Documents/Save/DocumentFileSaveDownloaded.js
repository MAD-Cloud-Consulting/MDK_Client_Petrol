import writeDocument from '../Save/DocumentSave';
import DocumentActionBinding from '../DocumentActionBinding';
export default function DocumentFileSaveDownloaded(pageProxy) {
    let actionBinding = DocumentActionBinding(pageProxy);
    let documentobject = actionBinding.Document ? actionBinding.Document : actionBinding.PRTDocument;
    writeDocument(pageProxy, documentobject);
}

