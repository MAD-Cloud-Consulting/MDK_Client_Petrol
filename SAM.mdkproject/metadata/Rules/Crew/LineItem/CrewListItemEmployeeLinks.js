import libCrew from '../CrewLibrary';

export default function CrewListItemEmployeeLinks(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libCrew.crewListItemEmployeeLinks(pageClientAPI);
}
