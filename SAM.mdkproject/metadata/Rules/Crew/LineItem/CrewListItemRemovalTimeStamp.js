import ODataDate from '../../Common/Date/ODataDate';

export default function CrewListItemRemovalTimeStamp(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return new ODataDate().toDBDateTimeString(pageClientAPI);
}
