import libPart from '../../PartLibrary';

export default function PartIssueHeaderBatch(pageClientAPI) {
    
    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libPart.partMovementHeaderCreateUpdateSetODataValue(pageClientAPI, 'Batch');
}
