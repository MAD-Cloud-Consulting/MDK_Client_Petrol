/**
* Allow the user to share the PDF
* @param {IClientAPI} clientAPI
*/
export default function PDFShare(clientAPI) {
    let pdfPage = clientAPI.evaluateTargetPathForAPI('#Page:PDFControl');
    let pdfExtensionControl = pdfPage.getControls()[0];
    pdfExtensionControl._control.share(); // Share the PDF
}
