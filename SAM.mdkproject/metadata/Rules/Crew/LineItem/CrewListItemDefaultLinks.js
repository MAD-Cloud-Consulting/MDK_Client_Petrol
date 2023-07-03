import libCrew from '../CrewLibrary';

export default function CrewListItemDefaultLinks(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libCrew.crewListItemDefaultLinks(pageClientAPI);
}
