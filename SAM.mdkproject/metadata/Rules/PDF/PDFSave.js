/**
* Save the data as an attachment for the service order
* @param {IClientAPI} clientAPI
*/
import libCom from '../Common/Library/CommonLibrary';
import documentLinksOnUpdate from '../Documents/Create/DocumentCreateBDSLink';
import pdfPath from './PDFTemplatePath';
import GetPDFPath from './GetPDFPath';

export default function PDFSave(clientAPI) {
    return pdfPath(clientAPI).then((path) => {
        let pdfPage = clientAPI.evaluateTargetPathForAPI('#Page:PDFControl');
        let pdfExtensionControl = pdfPage.getControls()[0];
        let binding = clientAPI.binding;

        let pdfName = path.substring(path.lastIndexOf('/') + 1).split('.')[0]; // Get the file name. Same as the html
        let pathToSave = path.substring(0, path.lastIndexOf('/')); // Save at the same path as html
        let serviceReportPath =  GetPDFPath(clientAPI, pathToSave, pdfName); // Check the duplicates and append the name
        pdfName = serviceReportPath.substring(serviceReportPath.lastIndexOf('/') + 1).split('.')[0]; // Get the new name
        
        pdfExtensionControl._control.save(pathToSave, pdfName); // Save the PDF
        let documentFileObject =  clientAPI.nativescript.fileSystemModule.File.fromPath(serviceReportPath); // Get the document object to read the file

        let readError = undefined;
        const pdfContent = documentFileObject.readSync(err => { // read the content to get data
            readError = err;
        });
        // If no read errors, create the BDS
        if (!readError) {
            let bindingItems = {
                'attachment' : [{'content':pdfContent, 'contentType':'application/pdf'}],
                'contentType': 'application/pdf',
                'FileName': pdfName + '.pdf', 
            };
            libCom.setStateVariable(clientAPI, 'attachmentProps', bindingItems);

            if (libCom.getStateVariable(clientAPI, 'contextMenuSwipePage')) { //coming in via the context menu
                binding = libCom.GetBindingObject(clientAPI);
                clientAPI._context.binding = binding;  
            }

            let completionBinding = libCom.getStateVariable(clientAPI, 'CompletionBinding');
            if (!binding || (completionBinding && completionBinding['@odata.type'] !== binding['@odata.type'])) {
                binding = libCom.getStateVariable(clientAPI, 'ServiceReportData');
                clientAPI._context.binding = binding;
            }
            
            if (binding && binding['@odata.type'] === clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentParentODataTypeSubOperation.global').getValue()) { 
                //We need to pass the operation's binding object to the doc generation code
                if (binding.WorkOrderOperation) {
                    clientAPI._context.binding = binding.WorkOrderOperation;  
                }
            }

            return clientAPI.executeAction('/SAPAssetManager/Actions/Documents/DocumentCreateBDS.action').then((data) => {
                libCom.setStateVariable(clientAPI, 'mediaReadLinks', [data.data[0]]);
                clientAPI._context.clientData.mediaReadLinks = [data.data[0]];
                return documentLinksOnUpdate(clientAPI);
            });
        } else {
            return clientAPI.executeAction('/SAPAssetManager/Rules/Documents/Create/DocumentOnCreateFailure.js');

        }
        
    });
    
}
