import libCrew from '../CrewLibrary';

export default function TimesheetCrewListItemCrewItemKey(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libCrew.crewListItemCreateUpdateSetODataValue(pageClientAPI, 'TimesheetCrewItemKey');
}
