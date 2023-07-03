import libPart from '../../PartLibrary';

export default function PartMovementHeaderUserName(pageClientAPI) {
    
    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libPart.partMovementHeaderCreateUpdateSetODataValue(pageClientAPI, 'UserName');
}
