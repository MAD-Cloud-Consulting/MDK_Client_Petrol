import CommonLibrary from '../Common/Library/CommonLibrary';

/**
* Sends the data for the PDF
* @param {IClientAPI} clientAPI
*/
export default function PDFData(clientAPI) {
    return CommonLibrary.getStateVariable(clientAPI, 'ServiceReportData');
}
