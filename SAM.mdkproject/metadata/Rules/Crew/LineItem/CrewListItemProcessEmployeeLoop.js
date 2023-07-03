import libCrew from '../CrewLibrary';

export default function CrewListItemProcessEmployeeLoop(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libCrew.crewListItemProcessEmployeeLoop(pageClientAPI);
}
