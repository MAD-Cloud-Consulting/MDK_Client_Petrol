import DocLib from './DocumentLibrary';
import libCom from '../Common/Library/CommonLibrary';

export default function SetIndicatorState(sectionProxy, path) {
    return DocLib.isMediaLocal(sectionProxy, path).then((isMediaLocal) => {
        const readLink = libCom.getTargetPathValue(sectionProxy, path);
        const docDownloadID = 'DocDownload.' + sectionProxy.binding.DocumentID;
        let isDownloadInProgress = libCom.getStateVariable(sectionProxy, docDownloadID);
        if (isMediaLocal) {
            // The media is saved locally, we can open it
            return 'open';
        } else if (isDownloadInProgress || (readLink && sectionProxy.downloadInProgressForReadLink(readLink))) {
            // the media is currently being downloaded
            return 'inProgress';
        } else {
            // The media is on the server, we can download it
            return 'toDownload';
        }
    });
}
