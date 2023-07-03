import libCom from '../../Common/Library/CommonLibrary';
import ODataDate from '../../Common/Date/ODataDate';
import validateData from '../Validation/ValidateIssueOrReceipt';
import onDemandObjectCreate from '../PurchaseOrder/PurchaseOrderOnDemandObjectDelete';
import SerialNumberLibrary from '../IssueOrReceipt/SerialNumberLibrary';
import IssueOrReceiptItemUpdate from './IssueOrReceiptItemUpdate';
import {SplitReadLink} from '../../Common/Library/ReadLinkUtils';
import allowIssue from '../StockTransportOrder/AllowIssueForSTO';
import libLocal from '../../Common/Library/LocalizationLibrary';
import itemsContextStateVariablesSet from '../MaterialDocument/ItemsContextStateVariablesSet';
import updateHeaderCountItems from '../InboundOrOutbound/UpdateHeaderCountItems';

export default function IssueOrReceiptCreateUpdatePost(context) {

    let binding = Object();
    //Binding specific fields
    let type = '';
    let item;
    let move = libCom.getStateVariable(context, 'IMMovementType');
    let objectType = libCom.getStateVariable(context, 'IMObjectType');

    if (context.binding) {
        binding = context.binding;
    } else if (context.getActionBinding()) {
        binding = context.getActionBinding();
    }
    if (binding['@odata.type']) {
        type = binding['@odata.type'].substring('#sap_mobile.'.length);
    }

    //Material document header fields (some from screen)
    binding.TempHeader_DocumentDate = new ODataDate(libCom.getControlProxy(context,'DocumentDate').getValue()).toLocalDateString();
    binding.TempHeader_MaterialDocYear = new ODataDate(libCom.getControlProxy(context,'DocumentDate').getValue()).toDBDate(context).getFullYear().toString();
    binding.TempHeader_PostingDate = new ODataDate().toDBDateString(context);
    binding.TempHeader_HeaderText = libCom.getControlProxy(context,'HeaderTextSimple').getValue();
    binding.TempHeader_DeliveryNote = libCom.getControlProxy(context,'DeliveryNoteSimple').getValue();
    binding.TempHeader_UserName = libCom.getSapUserName(context);

    //Line item (fields from screen)
    binding.TempLine_MovementType = libCom.getListPickerValue(libCom.getControlProxy(context,'MovementTypePicker').getValue());
    binding.TempLine_ItemText = libCom.getControlProxy(context,'ItemTextSimple').getValue();
    binding.TempLine_UnloadingPoint = libCom.getControlProxy(context,'UnloadingPointSimple').getValue();
    binding.TempLine_GLAccount = libCom.getControlProxy(context,'GLAccountSimple').getValue();
    binding.TempLine_CostCenter = libCom.getControlProxy(context,'CostCenterSimple').getValue();
    binding.TempLine_WBSElement = libCom.getControlProxy(context,'WBSElementSimple').getValue();
    binding.TempLine_Order = libCom.getControlProxy(context,'OrderSimple').getValue();
    binding.TempLine_Network = libCom.getControlProxy(context,'NetworkSimple').getValue();
    binding.TempLine_Activity = libCom.getControlProxy(context,'ActivitySimple').getValue();
    binding.TempLine_BusinessArea = libCom.getControlProxy(context,'BusinessAreaSimple').getValue();
    binding.TempLine_StorageBin = libCom.getControlProxy(context,'StorageBinSimple').getValue();
    binding.TempLine_GoodsReceipient = libCom.getControlProxy(context,'GoodsRecipientSimple').getValue();
    binding.TempLine_ValuationType = libCom.getListPickerValue(libCom.getControlProxy(context, 'ValuationTypePicker').getValue());
    binding.TempLine_Batch = libCom.getControlProxy(context,'BatchSimple').getValue().toUpperCase();
    binding.TempLine_MovementReason =  libCom.getListPickerValue(libCom.getControlProxy(context,'MovementReasonPicker').getValue());

    let autoSerialNumberSwitch = libCom.getControlProxy(context,'AutoSerialNumberSwitch').getValue();
    if (autoSerialNumberSwitch) {
        binding.TempLine_AutoGenerateSerialNumbers = 'X';
        binding.TempLine_EntryQuantity = libLocal.toNumber(context, libCom.getControlProxy(context, 'QuantitySimple').getValue());
    } else {
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
        binding.TempLine_EntryQuantity = libLocal.toNumber(context, binding.TempLine_SerialNumbers.length);
    }
    if (!binding.TempLine_EntryQuantity) {
        binding.TempLine_EntryQuantity = libLocal.toNumber(context, libCom.getControlProxy(context, 'QuantitySimple').getValue());
    }
    if (libCom.getControlProxy(context,'DeliveryCompleteSwitch').getValue()) {
        binding.TempLine_DeliveryComplete = 'X';
    } else {
        binding.TempLine_DeliveryComplete = '';
    }
    binding.TempLine_StorageLocation = libCom.getListPickerValue(libCom.getControlProxy(context,'StorageLocationPicker').getValue());
    binding.TempLine_SpecialStockInd = libCom.getListPickerValue(libCom.getControlProxy(context,'SpecialStockIndicatorPicker').getValue());
    binding.TempLine_StockType = libCom.getListPickerValue(libCom.getControlProxy(context,'StockTypePicker').getValue());
    if (binding.TempLine_StockType === 'UNRESTRICTED') {
        binding.TempLine_StockType = ''; //Unrestricted has value of 'UNRESTRICTED' to accomodate picker, but needs to be set to '' for database
    }
    binding.TempLine_ValuationTypeTo = libCom.getListPickerValue(libCom.getControlProxy(context, 'ValuationToPicker').getValue());

    //Find the item record we are receiving/issuing against
    if (type === 'MaterialDocItem') {
        binding.TempLine_Material = binding.Material;
        binding.TempLine_EntryUOM = binding.UOM;
        binding.TempLine_PurchaseOrderNumber='';
        binding.TempLine_PurchaseOrderItem='';
        binding.TempLine_ReservationNumber = '';
        binding.TempLine_ReservationItem = '';
        if (objectType === 'REV') {
            if (move === 'RET') {
                binding.TempHeader_GMCode = '01';
                binding.TempLine_MovementIndicator = 'B';
            } else if (move === 'REV') {
                binding.TempHeader_GMCode = '06'; //Reversal
                binding.TempLine_MovementIndicator = '';
            }
            if (move === 'EDIT') {
                binding.TempHeader_GMCode = binding.GMCode;
                binding.TempLine_MovementIndicator = binding.MovementIndicator;
                binding.TempLine_ReferenceDocHdr = binding.ReferenceDocHdr;
                binding.TempLine_ReferenceDocYear = binding.ReferenceDocYear;
                binding.TempLine_ReferenceDocItem = binding.ReferenceDocItem;
            } else {
                binding.TempLine_ReferenceDocHdr = binding.MaterialDocNumber;
                binding.TempLine_ReferenceDocYear = binding.MaterialDocYear;
                binding.TempLine_ReferenceDocItem = binding.MatDocItem;
            }
            binding.TempItem_ItemReadLink = binding['@odata.readLink'];
            binding.TempLine_Plant = binding.Plant;
            binding.TempLine_PurchaseOrderNumber = binding.PurchaseOrderNumber|| '';
            binding.TempLine_PurchaseOrderItem = binding.PurchaseOrderItem || '';
            binding.TempLine_ReservationNumber = binding.ReservationItemNumber || '';
            binding.TempLine_ReservationItem = binding.ReservationItemNumber || '';
        } else if (binding.PurchaseOrderItem_Nav) {
            binding.TempItem_ItemReadLink = binding.PurchaseOrderItem_Nav['@odata.readLink'];
            binding.TempItem_OpenQuantity = Number(binding.PurchaseOrderItem_Nav.OpenQuantity);
            binding.TempItem_ReceivedQuantity = binding.PurchaseOrderItem_Nav.ReceivedQuantity;
        } else if (context.binding.StockTransportOrderItem_Nav) {
            binding.TempItem_ItemReadLink = binding.StockTransportOrderItem_Nav['@odata.readLink'];
            binding.TempItem_OrderQuantity = binding.StockTransportOrderItem_Nav.OrderQuantity;
            binding.TempItem_ReceivedQuantity = binding.StockTransportOrderItem_Nav.ReceivedQuantity;
            binding.TempItem_IssuedQuantity = binding.StockTransportOrderItem_Nav.IssuedQuantity;
            binding.TempItem_OpenQuantity = Number(binding.StockTransportOrderItem_Nav.OpenQuantity); //Not used for STO but variable is necessary
        } else if (context.binding.ReservationItem_Nav) {
            binding.TempItem_ItemReadLink = binding.ReservationItem_Nav['@odata.readLink'];
            binding.TempItem_OpenQuantity = Number(binding.ReservationItem_Nav.RequirementQuantity) - Number(binding.ReservationItem_Nav.WithdrawalQuantity);
            binding.TempItem_ReceivedQuantity = binding.ReservationItem_Nav.WithdrawalQuantity;
        } else if (objectType === 'PRD') {
            if (context.binding.ProductionOrderComponent_Nav) {
                binding.TempItem_ItemReadLink = binding.ProductionOrderComponent_Nav['@odata.readLink'];
                binding.TempItem_OpenQuantity = Number(binding.ProductionOrderComponent_Nav.RequirementQuantity);
                binding.TempItem_ReceivedQuantity = binding.ProductionOrderComponent_Nav.WithdrawalQuantity;
            }
            if (context.binding.ProductionOrderItem_Nav) {
                binding.TempItem_ItemReadLink = binding.ProductionOrderItem_Nav['@odata.readLink'];
                binding.TempItem_OpenQuantity = Number(binding.ProductionOrderItem_Nav.OrderQuantity);
                binding.TempItem_ReceivedQuantity = binding.ProductionOrderItem_Nav.OrderQuantity;
            }
        }
        
        binding.TempLine_OldQuantity = binding.EntryQuantity;
        binding.TempLine_ToPlant = libCom.getListPickerValue(libCom.getControlProxy(context,'PlantToListPicker').getValue());
        binding.TempLine_ToStorageLocation = libCom.getListPickerValue(libCom.getControlProxy(context,'StorageLocationToListPicker').getValue());
        binding.TempLine_ToBatch = libCom.getControlProxy(context,'BatchNumTo').getValue().toUpperCase();
    } else if (type === 'PurchaseOrderItem') {
        binding.TempLine_OldQuantity = 0; //We don't have an old quantity becuase this isn't a material doc item
        item = binding;
        binding.TempLine_PurchaseOrderNumber = item.PurchaseOrderId;
        binding.TempLine_PurchaseOrderItem = item.ItemNum;
        binding.TempLine_EntryUOM = item.OrderUOM;
        binding.TempLine_Plant = item.Plant;
        binding.TempHeader_GMCode = '01'; //Goods receipt
        binding.TempLine_MovementIndicator = 'B'; //Receipt
        //Item values to update the PurchaseOrderItem reflecting this receipt
        binding.TempItem_OpenQuantity = item.OpenQuantity;
        binding.TempItem_ReceivedQuantity = item.ReceivedQuantity;
        binding.TempItem_ItemReadLink = item['@odata.readLink'];
        binding.TempLine_Material = item.MaterialNum;
    } else if (type === 'ProductionOrderItem') {
        binding.TempLine_OldQuantity = 0;
        item = binding;
        binding.TempLine_PurchaseOrderNumber = '';
        binding.TempLine_PurchaseOrderItem = '';
        binding.TempLine_PRDOrderNumber = item.OrderId;
        binding.TempLine_PRDOrderItem = item.ItemNum;
        binding.TempLine_EntryUOM = item.OrderUOM;
        binding.TempLine_Plant = item.PlanningPlant;
        binding.TempHeader_GMCode = '02'; //Goods receipt for PRD item
        binding.TempLine_MovementIndicator = 'F'; //Receipt for PRD item
        binding.TempItem_OpenQuantity = Number(item.OrderQuantity) - Number(item.ReceivedQuantity);
        binding.TempItem_ReceivedQuantity = item.ReceivedQuantity;
        binding.TempItem_ItemReadLink = item['@odata.readLink'];
        binding.TempLine_Material = item.MaterialNum;
    } else if (type === 'StockTransportOrderItem') {
        binding.TempLine_OldQuantity = 0;
        item = binding;
        binding.TempLine_PurchaseOrderNumber = item.StockTransportOrderId;
        binding.TempLine_PurchaseOrderItem = item.ItemNum;
        binding.TempLine_EntryUOM = item.OrderUOM;
        if (allowIssue(item)) { //Issue so use supply plant
            binding.TempLine_Plant = item.StockTransportOrderHeader_Nav.SupplyingPlant;
        } else {
            binding.TempLine_Plant = item.Plant;
        }
        //Item values to update the STO reflecting this receipt
        binding.TempItem_OrderQuantity = item.OrderQuantity;
        binding.TempItem_OpenQuantity = item.OpenQuantity;
        binding.TempItem_ReceivedQuantity = item.ReceivedQuantity;
        binding.TempItem_IssuedQuantity = item.IssuedQuantity;
        if (move === 'I') { //Issue
            binding.TempHeader_GMCode = '04';
            binding.TempLine_MovementIndicator = '';
        } else { //Receipt
            binding.TempHeader_GMCode = '01';
            binding.TempLine_MovementIndicator = 'B';
        }
        binding.TempItem_ItemReadLink = item['@odata.readLink'];
        binding.TempLine_Material = item.MaterialNum;
    } else if (type === 'ReservationItem' || type === 'ProductionOrderComponent') {
        binding.TempLine_OldQuantity = 0;
        item = binding;
        binding.TempLine_ReservationNumber = item.ReservationNum || item.Reservation;
        binding.TempLine_ReservationItem = item.ItemNum;
        binding.TempLine_EntryUOM = item.RequirementUOM;
        binding.TempLine_Plant = item.SupplyPlant;
        binding.TempLine_RecordType = item.RecordType;
        //Item values to update the reservationItem reflecting this issue
        binding.TempItem_OpenQuantity = Number(item.RequirementQuantity) - Number(item.WithdrawalQuantity);
        binding.TempItem_ReceivedQuantity = item.WithdrawalQuantity;
        binding.TempHeader_GMCode = '03'; //Goods issue
        binding.TempLine_MovementIndicator = ''; //Issue
        binding.TempItem_ItemReadLink = item['@odata.readLink'];
        binding.TempLine_Material = item.MaterialNum;
    }   else if (type === 'MaterialSLoc') {
        binding.TempLine_EntryUOM = binding.Material.BaseUOM;
        binding.TempLine_Plant = binding.Plant;
        binding.TempLine_Material = binding.MaterialNum;
        if (move === 'I') { //Issue
            if (objectType === 'TRF') {
                binding.TempHeader_GMCode = '04';
                binding.TempLine_ToPlant = libCom.getListPickerValue(libCom.getControlProxy(context,'PlantToListPicker').getValue());
                binding.TempLine_ToStorageLocation = libCom.getListPickerValue(libCom.getControlProxy(context,'StorageLocationToListPicker').getValue());
                binding.TempLine_ToBatch = libCom.getControlProxy(context,'BatchNumTo').getValue().toUpperCase();
                binding.TempLine_MovementIndicator = ''; //Transfer
            } else {
                binding.TempHeader_GMCode = '03'; //Goods issue
                binding.TempLine_MovementIndicator = ''; //Issue
            }
        } else if (move === 'R') { //Receipt
            binding.TempHeader_GMCode = '05'; //Goods receipt
            binding.TempLine_MovementIndicator = ''; //Receipt
        }
    } else {
        let materialReadLink = libCom.getListPickerValue(libCom.getControlProxy(context,'MatrialListPicker').getValue());
        let material = '';
        let plant = '';
        if (materialReadLink && materialReadLink.length > 0) {
            material = SplitReadLink(materialReadLink).MaterialNum;
            plant = SplitReadLink(materialReadLink).Plant;
        } 
        binding.TempLine_Material = material;
        binding.TempLine_Plant = plant;
        if (move === 'I' || move === 'T') { //Issue
            if (objectType === 'TRF' || move === 'T') {
                binding.TempHeader_GMCode = '04';
                binding.TempLine_ToPlant = libCom.getListPickerValue(libCom.getControlProxy(context,'PlantToListPicker').getValue());
                binding.TempLine_ToStorageLocation = libCom.getListPickerValue(libCom.getControlProxy(context,'StorageLocationToListPicker').getValue());
                binding.TempLine_ToBatch = libCom.getControlProxy(context,'BatchNumTo').getValue().toUpperCase();
            } else {
                binding.TempHeader_GMCode = '03';
            }
            binding.TempLine_MovementIndicator = ''; //Issue
        } else if (move === 'R') { //Receipt
            binding.TempHeader_GMCode = '05'; //Goods receipt
            binding.TempLine_MovementIndicator = ''; //Receipt
        }
        binding.TempLine_PurchaseOrderNumber='';
        binding.TempLine_PurchaseOrderItem='';
        binding.TempLine_ReservationNumber = '';
        binding.TempLine_ReservationItem = '';
        binding.TempLine_EntryUOM = libCom.getControlProxy(context,'UOMSimple').getValue();
    }

    return validateData(context).then(valid => {
        if (valid) {  
            binding.IsMatDocCreate = true;             
            //We already have a local material document for this inventory object, so keep adding to it
            if (!(objectType === 'REV' && move !== 'EDIT')) {
                if (libCom.getStateVariable(context, 'Temp_MaterialDocumentReadLink')) {
                    binding.TempHeader_MatDocReadLink = libCom.getStateVariable(context, 'Temp_MaterialDocumentReadLink');
                    binding.TempHeader_Key = libCom.getStateVariable(context, 'Temp_MaterialDocumentNumber');
                    binding.IsMatDocCreate = false;
                    //Update the existing material document item
                    if (type === 'MaterialDocItem') {
                        binding.TempLine_MatDocItemReadLink = binding['@odata.readLink'];
                        binding.TempItem_Key = binding.MatDocItem;
                        //Need this variable because after action on line 239 we lost binding.SerialNum
                        const serialNum = binding.SerialNum;
                        
                        //Update the material document header
                        return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptMaterialDocumentUpdate.action').then(() => {
                            //Update the material document item
                            return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptMaterialDocumentItemUpdate.action').then(() => {
                                binding.SerialNum = serialNum;
                                return SerialNumberLibrary.updateItemSerialNumber(context).then(() => {
                                    //Update the PO/STO/RES item counts
                                    return IssueOrReceiptItemUpdate(context).then(() => {    
                                        //Close screen and show success popup
                                        return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/DocumentCreateSuccessWithClose.action');
                                    });
                                });
                            });
                        });    
                    }
                    if (checkAdhocReceiptAbility(objectType)) {
                        // this would work only when we're adding multiple items to single document
                        if (!context.binding) {
                            context.setActionBinding(binding);
                        }
                        //Create related material document item
                        return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptMaterialDocumentItemCreateRelated.action').then(() => {
                            //Update the PO Item counts
                            return IssueOrReceiptItemUpdate(context).then(() => {  
                                //Create material document item serial numbers
                                return SerialNumberLibrary.createItemSerialNumber(context).then(() => {
                                    // update info in local variables to show data in the item list page
                                    return setStateFromContext(context, objectType).then(() => {
                                        if (type === 'DUMMY') { //This will never happen, used to fool metadata linter for now
                                            return onDemandObjectCreate(context);
                                        }  
                                        return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/DocumentRedirectToListClose.action');
                                    //});
                                    });
                                });
                            });
                        });
                    }
                    //Starting from PO/STO/RES item, so update the material document header, then create new item
                    return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptMaterialDocumentUpdate.action').then(() => {
                        //Create the material document item
                        return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptMaterialDocumentItemCreateRelated.action').then(() => {
                            //Update the read links on the new material document item
                            return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptMaterialDocumentItemUpdateLinks.action').then(() => {
                                //Create material document item serial numbers
                                return SerialNumberLibrary.createItemSerialNumber(context).then(() => {
                                    //Update the PO/STO/RES ttem counts
                                    return IssueOrReceiptItemUpdate(context).then(() => {  
                                        return updateHeaderCountItems(context).then(() => {
                                            //Close screen and show success popup
                                            return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/DocumentCreateSuccessWithClose.action');
                                        });  
                                    });
                                });
                            });
                        });
                    });    
                }
            }

            if (!context.binding) {
                context.setActionBinding(binding);
            }
            //No existing material document for this PO, so create the material document header and item
            return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptMaterialDocumentCreate.action').then(() => {
                //Create the material document item
                return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptMaterialDocumentItemCreate.action').then(() => { 
                    //Update the PO Item counts
                    return IssueOrReceiptItemUpdate(context).then(() => {  
                        //Create material document item serial numbers
                        return SerialNumberLibrary.createItemSerialNumber(context).then(() => {
                            //Create or update the on demand object record to refresh the PO from backend
                            //return onDemandObjectCreate(context).then(() => {
                            // update info in local variables to show data in the item list page
                            // also adding local doc id to state variable too, for future actions
                            return setStateFromContext(context, objectType, true).then(() => {
                                if (type === 'DUMMY') { //This will never happen, used to fool metadata linter for now
                                    return onDemandObjectCreate(context);
                                }  
                                //Close screen and show success popup
                                if (checkAdhocReceiptAbility(objectType)) {
                                    return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/DocumentRedirectToListClose.action');
                                }
                                return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/DocumentCreateSuccessWithClose.action');
                            //});
                            });
                        });
                    });
                });
            });      
        }
        return false; //Validation failed
    });
}

// setting params for the item list modal window
// also adding doc id to state variable, if setId is true
async function setStateFromContext(context, objectType, setId = false) {
    if (checkAdhocReceiptAbility(objectType)) {
        libCom.removeStateVariable(context, 'MaterialPlantValue');
        libCom.removeStateVariable(context, 'MaterialSLocValue');
        libCom.removeStateVariable(context, 'BatchRequiredForFilterADHOC');
        let docInfo = context.getActionBinding();
        if (docInfo) {
            if (setId) {
                context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().ActualDocId = docInfo.TempHeader_Key;
                let fixedData = {
                    headerNote: docInfo.TempHeader_HeaderText,
                    order: docInfo.TempLine_Order,
                    network: docInfo.TempLine_Network,
                    cost_center: docInfo.TempLine_CostCenter,
                    project: docInfo.TempLine_WBSElement,

                };
                context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().FixedData = fixedData;
            }
            let params = {
                MovementType: docInfo.TempLine_MovementType,
                StorageLocation: docInfo.TempLine_StorageLocation,
                Plant: docInfo.TempLine_Plant,
                OrderNumber: docInfo.TempLine_Order,
            };
            return itemsContextStateVariablesSet(context, docInfo.TempHeader_Key, params);
        }
        
    }
    return Promise.resolve();
}

// check for ability to add multiple params (enable ability)
function checkAdhocReceiptAbility(objectType) {
    return (objectType === 'ADHOC');
}
