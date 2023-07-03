import GenerateLocalID from '../../../Common/GenerateLocalID';

export default function PartIssueLineItemLocalID(context) {
    let queryOptions = '';
    let localMatDocId = context.getClientData().LocalMatDocId;

    if (localMatDocId) {
        queryOptions = `$filter=MatDocItem eq '${localMatDocId}'`;
    }

    return GenerateLocalID(context, 'MaterialDocItems', 'MatDocItem', '0000', queryOptions, '').then(LocalId => {
        return LocalId;
    });
}
