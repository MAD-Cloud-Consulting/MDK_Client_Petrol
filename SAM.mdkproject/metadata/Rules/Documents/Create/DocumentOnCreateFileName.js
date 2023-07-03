import ComLib from '../../Common/Library/CommonLibrary';

/**
* Get the file name that was saved while creating a workorder/notification
* @param {IClientAPI} context
*/
export default function DocumentOnCreateFileName(context) {

    let attachmentProps = ComLib.getStateVariable(context, 'attachmentProps');

    if (attachmentProps && attachmentProps.FileName) {
        return attachmentProps.FileName;
    } else {
        return '';
    }
    
}
