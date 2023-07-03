import ComLib from '../../Common/Library/CommonLibrary';

/**
* Get the mime type that was saved while creating a workorder/notification
* @param {IClientAPI} context
*/
export default function DocumentOnCreateMimeType(context) {

    let attachmentProps = ComLib.getStateVariable(context, 'attachmentProps');

    if (attachmentProps && attachmentProps.contentType) {
        return attachmentProps.contentType;
    } else {
        return '';
    }
}
