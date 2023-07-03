import libPart from '../PartLibrary';

export default function PartCreateUpdateValidation(pageClientAPI) {
    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    //Check field data against business logic here
    //Return true if validation succeeded, or False if failed
    return libPart.partCreateUpdateValidation(pageClientAPI).then(result => {
        return result;
    });
}
