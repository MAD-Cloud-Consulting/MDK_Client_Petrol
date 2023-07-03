import libCommon from '../Common/Library/CommonLibrary';

export default function DocumentTypeIcon(context) {
    let binding = context.getBindingObject();
    let docType = binding.Document.MimeType;
    var icon = '/SAPAssetManager/Images/generic-file.pdf';
    if (libCommon.isDefined(docType)) {
        if (docType.includes('text') || docType.includes('word') || docType.includes('wordprocessingml')) {
           icon = '/SAPAssetManager/Images/text-file.pdf';
        } else if (docType.includes('video')) {
           icon = '/SAPAssetManager/Images/video-file.pdf';
        } else if (docType.includes('image') || docType.includes('jpeg') || docType.includes('jpg')) {
            icon = '/SAPAssetManager/Images/image-file.pdf';
        } else if (docType.includes('audio')) {
            icon = '/SAPAssetManager/Images/audio-file.pdf';
        } else if (docType.includes('pdf')) {
            icon = '/SAPAssetManager/Images/pdf-file.pdf';
        } else if (docType.includes('csv') || docType.includes('separated-values')) {
            icon = '/SAPAssetManager/Images/csv-file.pdf';
        }  else if (docType.includes('excel') || docType.includes('spreadsheetml')) {
            icon = '/SAPAssetManager/Images/table-file.pdf';
        } else if (docType.includes('powerpoint') || docType.includes('presentationml')) {
            icon = '/SAPAssetManager/Images/presentation-file.pdf';
        }
    }
    return icon;
}
