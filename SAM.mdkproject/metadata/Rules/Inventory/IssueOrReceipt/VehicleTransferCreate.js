import libCom from '../../Common/Library/CommonLibrary';
import ODataDate from '../../Common/Date/ODataDate';
import SerialNumberLibrary from '../IssueOrReceipt/SerialNumberLibrary';
import libLocal from '../../Common/Library/LocalizationLibrary';
import ValidateVehicleTransfer from '../Validation/ValidateVehicleTransfer';
import {SplitReadLink} from '../../Common/Library/ReadLinkUtils';
/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function VehicleTransferCreate(context) {
    let binding = Object();

    let onlineSwitch = context.evaluateTargetPath('#Control:OnlineSwitch').getValue();
    let service = onlineSwitch ? '/SAPAssetManager/Services/OnlineAssetManager.service' : '/SAPAssetManager/Services/AssetManager.service';
    let plantPickerValue = libCom.getListPickerValue(libCom.getControlProxy(context,'PlantLstPkr').getValue());
    let storagePickerValue = libCom.getListPickerValue(libCom.getControlProxy(context,'StorageLocationLstPkr').getValue());
    let materialPickerValue = libCom.getListPickerValue(libCom.getControlProxy(context,'MaterialLstPkr').getValue());
    let userPlant = libCom.getUserDefaultPlant();
    let userStorage = libCom.getUserDefaultStorageLocation();
    let transferType = libCom.getControlProxy(context,'TransferSeg').getValue()[0].ReturnValue;
    let isTransferFrom = transferType === context.localizeText('from_vehicle');
    let batchListPkrValue = libCom.getListPickerValue(libCom.getControlProxy(context,'BatchLstPkr').getValue());
    let batchSimpleValue = context.evaluateTargetPathForAPI('#Control:BatchSimple').getValue();
    let batch = batchListPkrValue ? batchListPkrValue : batchSimpleValue;
    let objectType = libCom.getStateVariable(context, 'IMObjectType');

    if (context.getClientData()) {
        binding = context.getClientData();
    }
    if (materialPickerValue) {
        let readLinkData = SplitReadLink(materialPickerValue);
        let query = onlineSwitch 
        ? `$filter=Plant eq '${readLinkData.Plant}' and StorageLocation eq '${readLinkData.StorageLocation}' and MaterialNum eq '${readLinkData.MaterialNum}'`
        : '';
        if (onlineSwitch) {
            materialPickerValue = 'MaterialSLocs';
        }
        return context.read(service, materialPickerValue, [], query).then(result => {
            //Material document header fields (some from screen)
            binding.TempHeader_DocumentDate = new ODataDate(new Date().getTime()).toLocalDateString();
            binding.TempHeader_MaterialDocYear = new ODataDate(new Date().getTime()).toDBDate(context).getFullYear().toString();
            binding.TempHeader_PostingDate = new ODataDate().toDBDateString(context);
            binding.TempHeader_HeaderText = '';
            binding.TempHeader_DeliveryNote = '';
            binding.TempHeader_UserName = libCom.getSapUserName(context);
            binding.TempHeader_GMCode = '04';
        
        
            //Line item (fields from screen)
            binding.TempLine_MovementType = '311';
            binding.TempLine_EntryQuantity = libLocal.toNumber(context, libCom.getControlProxy(context,'QuantitySimple').getValue());
            binding.TempLine_Batch = batch;
            binding.TempLine_ItemText = '';
            binding.TempLine_UnloadingPoint = '';
            binding.TempLine_GLAccount = '';
            binding.TempLine_CostCenter = '';
            binding.TempLine_WBSElement = '';
            binding.TempLine_Order = '';
            binding.TempLine_Network = '';
            binding.TempLine_Activity = '';
            binding.TempLine_BusinessArea = '';
            binding.TempLine_StorageBin = '';
            binding.TempLine_GoodsReceipient = '';
            binding.TempLine_AutoGenerateSerialNumbers = '';
            binding.TempLine_SerialNumbers = [];
            const serialNumbers = libCom.getStateVariable(context,'SerialNumbers').actual || (context.binding && context.binding.SerialNum) || [];
            if (serialNumbers.length) {
                for (let i = 0; i < serialNumbers.length; i++) {
                    if (serialNumbers[i].SerialNum) {
                        binding.TempLine_SerialNumbers.push(serialNumbers[i].SerialNum);
                    } else if (serialNumbers[i].selected) {
                        binding.TempLine_SerialNumbers.push(serialNumbers[i].SerialNumber);
                    }
                }
            }
            binding.TempLine_DeliveryComplete = '';
            binding.TempLine_StorageLocation = isTransferFrom ? userStorage : storagePickerValue; // get value based on switcher
            binding.TempLine_SpecialStockInd = '';
            binding.TempLine_StockType = '';
            binding.TempLine_ValuationType = '';
            binding.TempLine_SpecialStockInd = '';
            binding.TempLine_EntryUOM = libCom.getListPickerValue(libCom.getControlProxy(context,'MaterialUOMLstPkr').getValue());
            binding.TempLine_Plant = isTransferFrom ? userPlant : plantPickerValue;
            if (result) {
                binding.TempLine_Material = result.getItem(0).MaterialNum;
            } else {            
                binding.TempLine_Material = '';
            }
            binding.TempLine_ToPlant = !isTransferFrom ? userPlant : plantPickerValue; // get value based on switcher
            binding.TempLine_ToStorageLocation = !isTransferFrom ? userStorage : storagePickerValue;// get value based on switcher
            binding.TempLine_ToBatch = batch;
            binding.TempLine_MovementIndicator = ''; //Transfer
        
            return ValidateVehicleTransfer(context).then(valid => {
                if (valid) {
                    if (libCom.getStateVariable(context, 'Temp_MaterialDocumentReadLink')) {
                        binding.TempHeader_MatDocReadLink = libCom.getStateVariable(context, 'Temp_MaterialDocumentReadLink');
                        binding.TempHeader_Key = libCom.getStateVariable(context, 'Temp_MaterialDocumentNumber');
                        binding.TempLine_MatDocItemReadLink = libCom.getStateVariable(context, 'TempLine_MatDocItemReadLink');
                        binding.TempLine_MatDocItem = libCom.getStateVariable(context, 'TempLine_MatDocItem');
                        binding.TempItem_Key = binding.TempLine_MatDocItem;

                        binding.IsMatDocCreate = false;
                        if (objectType === 'ADHOC') {
                            //Create related material document item
                            return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/VehicleIssueOrReceiptMaterialDocumentItemCreateRelated.action').then(() => {
                                //Create material document item serial numbers
                                return SerialNumberLibrary.createItemSerialNumber(context).then(() => {
                                    return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/DocumentRedirectToListClose.action');
                                });
                            });
                        } else {
                            //Update the material document header
                            return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/VehicleIssueOrReceiptMaterialDocumentUpdate.action').then(() => {
                                //Update the material document item
                                return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/VehicleIssueOrReceiptMaterialDocumentItemUpdate.action').then(() => {
                                    return SerialNumberLibrary.updateItemSerialNumber(context).then(() => {
                                        //Close screen and show success popup
                                        return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/DocumentCreateSuccessWithClose.action');
                                    });
                                });
                            });    
                        }
                    } else {
                        // No existing material document for this PO, so create the material document header and item
                        return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/VehicleIssueOrReceiptMaterialDocumentCreate.action').then(() => {
                            //Create the material document item
                            return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/VehicleIssueOrReceiptMaterialDocumentItemCreate.action').then(() => {
                                return SerialNumberLibrary.createItemSerialNumber(context).then(() => {
                                    return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/DocumentCreateSuccessWithClose.action');
                                });
                            });
                        });      
                    }
                }
                return false;
            }
            );
        });
    } else {
        return ValidateVehicleTransfer(context).then(valid => {
            if (valid) {
                return true;     
            }
            return false;
        });
    }
}
