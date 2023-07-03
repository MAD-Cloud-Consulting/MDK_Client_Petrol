import libCrew from '../CrewLibrary';

export default function CrewVehicleCreateQueryOptions(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    return libCrew.crewVehicleCreateQueryOptions(pageClientAPI);
    
}
