import libCrew from '../CrewLibrary';

export default function TimesheetCrewListItemEmployeeLinks(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libCrew.timesheetCrewListItemEmployeeLinks(pageClientAPI);
}
