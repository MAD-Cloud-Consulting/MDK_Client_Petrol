import libPart from './PartLibrary';

export default function PartPlant(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libPart.partFieldFormat(pageClientAPI, 'Plant');

}
