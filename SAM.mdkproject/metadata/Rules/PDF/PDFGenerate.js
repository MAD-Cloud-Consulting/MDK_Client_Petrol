import { PartnerFunction } from '../Common/Library/PartnerFunction';
import CommonLibrary from '../Common/Library/CommonLibrary';
import OffsetODataDate from '../Common/Date/OffsetODataDate';
import libVal from '../Common/Library/ValidationLibrary';
import DocumentLibrary from '../Documents/DocumentLibrary';
import Logger from '../Log/Logger';

export default function PDFGenerate(context, completionBinding) {
    let binding = completionBinding || context.binding;

    if (CommonLibrary.getStateVariable(context, 'contextMenuSwipePage')) { //coming in via the context menu
        binding = CommonLibrary.GetBindingObject(context);
    }


    CommonLibrary.setStateVariable(context, 'CompletionBinding', completionBinding);

    let serviceName = '/SAPAssetManager/Services/AssetManager.service';
    let orderId = binding.OrderId || binding.OrderID;
    return context.read(serviceName, 'MyWorkOrderHeaders', [], `$filter=OrderId eq '${orderId}'&$expand=Equipment,Operations,WOSales_Nav,Operations/EquipmentOperation,WOObjectList_Nav/Equipment_Nav,Operations/WOObjectList_Nav/Equipment_Nav,OrderMobileStatus_Nav,WOSales_Nav/Customer_Nav,HeaderLongText,Operations/OperationMobileStatus_Nav`).then(orderResult => {

        if (orderResult.length > 0) {
            let order = orderResult.getItem(0);
            let promises = [];
            let userId = CommonLibrary.getSapUserName(context);

            //Get the technician name
            let sapUserPromise = context.read(serviceName, 'SAPUsers', ['UserName'], `$filter=UserId eq '${userId}'`);
            promises.push(sapUserPromise);

            //Get the sold to party address
            let addressPromise = context.read(serviceName, `${order['@odata.readLink']}/WOPartners`, [], `$filter=PartnerFunction eq '${PartnerFunction.getSoldToPartyPartnerFunction()}'&$expand=Address_Nav`);
            promises.push(addressPromise);

            //Get all attachments
            let attachmentsPromise = context.read(serviceName, 'MyWorkOrderDocuments', [], `$filter=OrderId eq '${order.OrderId}'&$expand=Document`);
            promises.push(attachmentsPromise);

            //Get all materials
            let materialsPromise = context.read(serviceName, 'MyWorkOrderComponents', [], `$filter=OrderId eq '${order.OrderId}'`);
            promises.push(materialsPromise);

            return Promise.all(promises).then(results => {
                
                populateUserName(order, results[0]);
                populateAddress(order, results[1]);
                populateAttachmentsAndSignatures(context, order, results[2], binding);
                populateAllEquipment(order);
                setupAdditionalProperties(context, order);
                populateMaterials(order, results[3]);

                binding.Order = order;
                if (context.getPageProxy() && context.getPageProxy().setActionBinding) {
                    context.getPageProxy().setActionBinding(binding);
                }
                CommonLibrary.setStateVariable(context, 'ServiceReportData', binding);
                return context.executeAction('/SAPAssetManager/Actions/PDF/PDFControlPageNav.action');

            });
        } else {     
            Logger.info(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDocuments.global').getValue(), 'No data for pdf, WO id ' + orderId);
            return Promise.resolve();
        }
    })
    .catch((error) => {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDocuments.global').getValue(), 'Error getting data for pdf: ' + error);
    });

}
function setupAdditionalProperties(context, workOrder) {
    let formattedDate = '';
    
    if (workOrder.WOSales_Nav && workOrder.WOSales_Nav.ContractDateTo) {
        let odataDate = new OffsetODataDate(context, workOrder.WOSales_Nav.ContractDateTo);
        formattedDate = context.formatDate(odataDate.date());
        workOrder.WOSales_Nav.ContractDateTo = formattedDate;
    }
    if (libVal.evalIsEmpty(workOrder.OrderDescription)) {
        workOrder.OrderDescription = '-';
    }
}

function populateAttachmentsAndSignatures(context, workOrder, results, binding) {

    let attachments = [];
    workOrder.TechnicianSignature = '';
    workOrder.CustomerSignature = '';

    let customerSignaturePrefix = context.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentCustomerSignaturePrefix.global').getValue();
    let technicianSignaturePrefix = context.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentTechnicianSignaturePrefix.global').getValue();
    let workOrderOperationDataType = context.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentParentODataTypeOperation.global').getValue();

    if (results.length > 0) {
        for (let i=0; i < results.length; i++) {
            let attachment = results.getItem(i);
            let document = attachment.Document;

            if (document && document.hasOwnProperty('@sap.mediaIsOffline') && document['@sap.mediaIsOffline'] && document['@odata.mediaContentType'].includes('image')) { //Only grab the ones that are local/downloaded & show only images
                let base64String = DocumentLibrary.getBase64String(context, document);

                if (document.FileName.startsWith(technicianSignaturePrefix)) { //Technician Signature
                    //if we are at operation level then we need to grab the signature from operation level
                    if (binding['@odata.type'] === workOrderOperationDataType) {
                        if (attachment.OperationNo === binding.OperationNo) {
                            workOrder.TechnicianSignature = base64String;
                        }
                    } else {
                        workOrder.TechnicianSignature = base64String;
                    }
                } else if (document.FileName.startsWith(customerSignaturePrefix)) { //Customer Signature
                    //if we are at operation level then we need to grab the signature from operation level
                    if (binding['@odata.type'] === workOrderOperationDataType) {
                        if (attachment.OperationNo === binding.OperationNo) {
                            workOrder.CustomerSignature = base64String;
                        }
                    } else {
                        workOrder.CustomerSignature = base64String;
                    }
                } else { //Any other attachment
                    attachments.push({'Description': document.Description, 'AttachmentSrc': base64String});
                }
            } else {
                continue;
            }
            
        }
    }

    workOrder.Attachments = attachments;
}

function populateAddress(workOrder, results) {
    workOrder.ServiceAddress = '';

    if (results.length > 0) {
        let workOrderPartner = results.getItem(0);
        if (workOrderPartner.Address_Nav) {
            workOrder.ServiceAddress = workOrderPartner.Address_Nav;
        }
    }
    
}

function populateAllEquipment(workOrder) {
    let allEquipment = [];

    if (workOrder.Equipment && !allEquipment.some(equipment => equipment.EquipId === workOrder.Equipment.EquipId)) { //only add the equipment if it doesn't already exist
        allEquipment.push(workOrder.Equipment);
    }

    if (workOrder.WOObjectList_Nav.length > 0) {
        workOrder.WOObjectList_Nav.forEach(woObject => {
            if (woObject && woObject.EquipId && !allEquipment.some(equipment => equipment.EquipId === woObject.EquipId)) {
                allEquipment.push(woObject.Equipment_Nav);
            }
        });
    }

    if (workOrder.Operations.length > 0) {
        workOrder.Operations.forEach(operation => {

            if (operation.EquipmentOperation && !allEquipment.some(equipment => equipment.EquipId === operation.EquipmentOperation.EquipId)) {
                allEquipment.push(operation.EquipmentOperation);
            }

            if (operation.WOObjectList_Nav.length > 0) {
                operation.WOObjectList_Nav.forEach(operationObject => {
                    if (operationObject && operationObject.EquipId && !allEquipment.some(equipment => equipment.EquipId === operationObject.EquipId)) {
                        allEquipment.push(operationObject.Equipment_Nav);
                    }
                });
            }

        });
    }
    
    workOrder.AllEquipment = allEquipment;
}

function populateUserName(workOrder, results) {
    workOrder.TechnicianName = '-';

    if (results.length > 0) {
        let sapUser = results.getItem(0);
        if (sapUser && sapUser.UserName) {
            workOrder.TechnicianName = sapUser.UserName;
        }
    }
    
}

function populateMaterials(order, results) {
    order.Components = [];

    for (let i=0; i < results.length; i++) {
        order.Components.push(results.getItem(i));
    }
}
