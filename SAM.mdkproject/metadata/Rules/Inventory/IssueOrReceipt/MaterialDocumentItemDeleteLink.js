import libVal from '../../Common/Library/ValidationLibrary';

export default function MaterialDocumentItemDeleteLink(context) {
    let matDocItemLink;
    if (!libVal.evalIsEmpty(context.binding) && !libVal.evalIsEmpty(context.binding.TempLine_MatDocItemReadLink)) { //We are not in a changeset, mat doc is being updated
        matDocItemLink = context.binding.TempLine_MatDocItemReadLink;
    } else if (!libVal.evalIsEmpty(context.getActionBinding()) && !libVal.evalIsEmpty(context.getActionBinding().TempLine_MatDocItemReadLink)) { //We are not in a changeset, mat doc is being updated
        matDocItemLink = context.getActionBinding().TempLine_MatDocItemReadLink;
    } else {
        matDocItemLink = context.getClientData().TempLine_MatDocItemReadLink;
    }
    if (!libVal.evalIsEmpty(matDocItemLink)) { //We are not in a changeset, mat doc is being updated
        let links = [];
    
        links.push({
            'Property': 'MatDocItem_Nav',
            'Target':
            {
                'EntitySet': 'MaterialDocItems',
                'ReadLink': matDocItemLink,
            },
        });
        //return `MaterialDocItems(MatDocItem='${context.binding.TempItem_Key}',MaterialDocNumber='${context.binding.TempHeader_Key}',MaterialDocYear='${context.binding.TempHeader_MaterialDocYear}')`;
    return links;
}
}
