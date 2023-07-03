import libPart from '../../PartLibrary';

export default function PartMovementHeaderDocumentDate(pageClientAPI) {
    
    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libPart.partMovementHeaderCreateUpdateSetODataValue(pageClientAPI, 'DocumentDate');
}
