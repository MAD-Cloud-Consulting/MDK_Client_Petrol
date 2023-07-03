import GenerateLocalID from '../../../Common/GenerateLocalID';

export default function PartIssueDocumentLocalID(context) {
    return GenerateLocalID(context, 'MaterialDocuments', 'MaterialDocNumber', '0000000000', '', '').then(LocalId => {
        context.getClientData().LocalMatDocId = LocalId;
        return LocalId;
    });
}
