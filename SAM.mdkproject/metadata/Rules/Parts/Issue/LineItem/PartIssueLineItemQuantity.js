import libPart from '../../PartLibrary';
	
export default function PartIssueLineItemQuantity(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    let partIssue = libPart.partMovementLineItemCreateUpdateSetODataValue(pageClientAPI, 'Quantity').toString();
    if (partIssue.includes(',')) {
        partIssue = partIssue.replace(',', '.');
    }
    return partIssue;
}
