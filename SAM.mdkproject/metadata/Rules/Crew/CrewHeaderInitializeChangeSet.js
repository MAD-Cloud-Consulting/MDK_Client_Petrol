import libCrew from './CrewLibrary';

export default function CrewHeaderInitializeChangeSet(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libCrew.initializeCrewHeaderChangeset(pageClientAPI);
}
