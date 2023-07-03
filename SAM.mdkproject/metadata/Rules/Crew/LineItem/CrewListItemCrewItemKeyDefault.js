import libCrew from '../CrewLibrary';

export default function CrewListItemCrewItemKeyDefault(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libCrew.crewListItemCreateUpdateSetODataValueDefault(pageClientAPI, 'CrewItemKey');
}
