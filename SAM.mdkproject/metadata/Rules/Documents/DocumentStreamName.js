import DocumentActionBinding from './DocumentActionBinding';
export default function DocumentStreamName(clientAPI) {
    let actionBinding = DocumentActionBinding(clientAPI);
    let documentobject = actionBinding.Document_Nav ? actionBinding.Document_Nav : actionBinding.Document ? actionBinding.Document : actionBinding.PRTDocument;
    return documentobject['@odata.id'].replace(/[()=',]/g, '');
}
