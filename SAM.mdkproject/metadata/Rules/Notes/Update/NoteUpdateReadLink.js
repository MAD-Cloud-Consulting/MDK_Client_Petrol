/**
* Get readLink for note update action
*/
export default function NoteUpdateReadLink(clientAPI) {
    let longText = clientAPI.binding.LongText;
    if (Array.isArray(longText)) {
        return clientAPI.binding.LongText[0]['@odata.readLink'];
    }
    return clientAPI.binding.LongText['@odata.readLink'];
}
