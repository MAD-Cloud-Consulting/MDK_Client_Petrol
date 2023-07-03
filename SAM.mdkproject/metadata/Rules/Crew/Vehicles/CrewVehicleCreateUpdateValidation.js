import libCrew from '../CrewLibrary';

export default function CrewVehicleCreateUpdateValidation(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libCrew.CrewVehicleCreateUpdateValidation(pageClientAPI).then(result => {
        return result;
    });  
}
