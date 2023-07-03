import libPart from '../../PartLibrary';

export default function PartReturnCreateLineItemSuccess(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libPart.partReturnCreateLineItemSuccess(pageClientAPI);

}
