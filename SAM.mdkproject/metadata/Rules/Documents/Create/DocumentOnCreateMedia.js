import ComLib from '../../Common/Library/CommonLibrary';

/**
* Get the attachment data that was saved while creating a workorder/notification
* @param {IClientAPI} context
*/
export default function DocumentOnCreateMedia(context) {

    let attachmentProps = ComLib.getStateVariable(context, 'attachmentProps');

    if (attachmentProps && attachmentProps.attachment && attachmentProps.attachment.length > 0) {
        return attachmentProps.attachment;
    } else {
        return '';
    }

}
