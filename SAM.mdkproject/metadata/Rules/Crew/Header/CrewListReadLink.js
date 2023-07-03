import libCrew from '../CrewLibrary';

export default function CrewListReadLink(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libCrew.crewListCreateUpdateSetODataValue(pageClientAPI, 'ReadLink');
}
