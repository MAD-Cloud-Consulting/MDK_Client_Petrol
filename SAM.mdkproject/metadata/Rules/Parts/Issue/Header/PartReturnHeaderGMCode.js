import libPart from '../../PartLibrary';

export default function PartReturnHeaderGMCode(pageClientAPI) {
    
    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libPart.partMovementHeaderCreateUpdateSetODataValue(pageClientAPI, 'GMCode', 'GoodsReturn');
}
