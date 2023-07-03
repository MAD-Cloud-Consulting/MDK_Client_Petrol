import DownloadDocuments from './DownloadDocuments';
import libCom from '../../Common/Library/CommonLibrary';

export default function SetDownloadDocumentsVariable(context) {
    let downloadStarted = libCom.getStateVariable(context, 'DownloadIMDocsStarted');
    if (!downloadStarted) {
        libCom.setStateVariable(context, 'DownloadIMDocsStarted', true);
        return DownloadDocuments(context);
    }
    return Promise.resolve();
}
