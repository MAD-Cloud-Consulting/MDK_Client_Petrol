import libPart from '../../PartLibrary';

export default function PartMovementHeaderMaterialDocYear(pageClientAPI) {
    
    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libPart.partMovementHeaderCreateUpdateSetODataValue(pageClientAPI, 'MaterialDocYear');
}
