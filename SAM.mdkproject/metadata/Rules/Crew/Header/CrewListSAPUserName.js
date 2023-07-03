import libCrew from '../CrewLibrary';

export default function CrewListSAPUserName(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libCrew.crewListCreateUpdateSetODataValue(pageClientAPI, 'SAPUserName');

}
