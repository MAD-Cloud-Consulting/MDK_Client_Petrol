import libCrew from '../CrewLibrary';

export default function CrewListItemProcessVehicleLoop(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libCrew.crewListItemProcessVehicleLoop(pageClientAPI);
}
