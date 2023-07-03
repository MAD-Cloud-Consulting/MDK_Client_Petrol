import libPart from '../../PartLibrary';

export default function PartReturnValidation(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    //Check field data against business logic here
    //Return true if validation succeeded, or False if failed
    return libPart.partReturnValidation(pageClientAPI).then(result => {
        return result;
    });
}
