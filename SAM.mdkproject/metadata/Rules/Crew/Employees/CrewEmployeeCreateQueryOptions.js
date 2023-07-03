import libCrew from '../CrewLibrary';

export default function CrewEmployeeCreateQueryOptions(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    return libCrew.crewEmployeeCreateQueryOptions(pageClientAPI);
    
}
