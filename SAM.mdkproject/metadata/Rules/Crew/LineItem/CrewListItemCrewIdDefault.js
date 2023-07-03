import libCrew from '../CrewLibrary';

export default function CrewListItemCrewIdDefault(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libCrew.crewListItemCreateUpdateSetODataValueDefault(pageClientAPI, 'CrewId');
}
