import libCrew from '../CrewLibrary';

export default function CrewListUserGuid(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libCrew.crewListCreateUpdateSetODataValue(pageClientAPI, 'UserGuid');

}
