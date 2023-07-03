import libCrew from '../CrewLibrary';

export default function TimesheetCrewListCrewId(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libCrew.crewListCreateUpdateSetODataValue(pageClientAPI, 'TimesheetCrewId');
}
