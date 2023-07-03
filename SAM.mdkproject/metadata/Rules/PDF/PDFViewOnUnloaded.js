import CommonLibrary from '../Common/Library/CommonLibrary';

export default function PDFViewOnUnloaded(clientAPI) {
    CommonLibrary.clearStateVariable(clientAPI, 'ServiceReportData');
    CommonLibrary.removeBindingObject(clientAPI);
    CommonLibrary.removeStateVariable(clientAPI, 'contextMenuSwipePage');
}
