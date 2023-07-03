import libPart from '../../PartLibrary';

export default function PartIssueCreateLineItemSuccess(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libPart.partIssueCreateLineItemSuccess(pageClientAPI);

}
