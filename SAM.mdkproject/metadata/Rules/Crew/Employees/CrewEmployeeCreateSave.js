import libCrew from '../CrewLibrary';

export default function CrewEmployeeCreateSave(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    libCrew.crewEmployeeCreateSave(pageClientAPI);

}
