import libPart from '../PartLibrary';
/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function VehiclePartCreateUpdateValidation(clientAPI) {
    if (!clientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    //Check field data against business logic here
    //Return true if validation succeeded, or False if failed
    return libPart.vehiclePartCreateUpdateValidation(clientAPI).then(result => {
        return result;
    });
}
