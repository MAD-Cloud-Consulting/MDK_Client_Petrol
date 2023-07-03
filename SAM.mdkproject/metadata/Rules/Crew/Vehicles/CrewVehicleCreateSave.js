import libCrew from '../CrewLibrary';

export default function CrewVehicleCreateSave(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    libCrew.crewVehicleCreateSave(pageClientAPI);

}
