import libPart from './PartLibrary';

export default function PartUOMQueryOptions(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libPart.partUOMQueryOptions(pageClientAPI);

}
