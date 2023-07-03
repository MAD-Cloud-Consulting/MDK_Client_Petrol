import DocLib from './DocumentLibrary';
import {ValueIfExists} from '../Common/Library/Formatter';
import DocumentPath from './DocumentPath';

export default function DocumentFileSize(clientAPI, document) {
    if (document) {
        let documentObject = clientAPI.binding;
        const attachmentPath = DocumentPath(clientAPI, documentObject.Document);
        const fileExists = clientAPI.nativescript.fileSystemModule.File.exists(attachmentPath);

        if (fileExists) {
            return DocLib.formatFileSize(clientAPI.nativescript.fileSystemModule.File.fromPath(attachmentPath).size);
        }
        return ValueIfExists(document.FileSize, '-', function(filesize) {
            return DocLib.formatFileSize(filesize);
        });
    }
}
