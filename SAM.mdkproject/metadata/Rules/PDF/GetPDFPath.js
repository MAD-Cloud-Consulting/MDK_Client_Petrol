/**
* Get Correct PDF Path for saving the file after checking duplicates
* @param {IClientAPI} clientAPI
* @param {String} path
*/

export default function GetPDFPath(clientAPI, path, pdfName) {
    let counter = 0;
    let serviceReportPath =  clientAPI.nativescript.fileSystemModule.path.join(path, pdfName + '.pdf');
    while (clientAPI.nativescript.fileSystemModule.File.exists(serviceReportPath)) {
        counter += 1;
        let newFileName = pdfName + counter;
        serviceReportPath = clientAPI.nativescript.fileSystemModule.path.join(path, newFileName + '.pdf');
    }
    return serviceReportPath;
}
