import libCrew from '../CrewLibrary';

export default function CrewListItemCreateValidation(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    //Check field data against business logic here
    //Return true if validation succeeded, or False if failed
    return libCrew.crewListItemCreateValidation(pageClientAPI).then(result => {
        return result;
    });
}
