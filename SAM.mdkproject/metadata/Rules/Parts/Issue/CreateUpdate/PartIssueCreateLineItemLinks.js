import libPart from '../../PartLibrary';

export default function PartIssueCreateLineItemLinks(pageClientAPI) {
    
    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libPart.partIssueCreateLineItemLinks(pageClientAPI);
}
