import libCrew from '../CrewLibrary';

export default function CrewListItemVehicleLinks(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libCrew.crewListItemVehicleLinks(pageClientAPI);
}
