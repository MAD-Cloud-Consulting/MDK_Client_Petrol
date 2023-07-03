import libPart from './PartLibrary';

export default function CreatePartIssueSuccessMessage(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libPart.createPartIssueSuccessMessage(pageClientAPI);

}
