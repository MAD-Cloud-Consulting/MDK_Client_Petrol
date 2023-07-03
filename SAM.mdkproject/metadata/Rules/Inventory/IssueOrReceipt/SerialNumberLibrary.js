import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import Logger from '../../Log/Logger';
import EnableMultipleTechnician from '../../SideDrawer/EnableMultipleTechnician';

export default class {

    static createItemSerialNumber(context, addCounter) {
        let binding;
        let action = '';
        let vehicleFlag = EnableMultipleTechnician(context);

        if (!libVal.evalIsEmpty(context.getActionBinding())) {
            binding = context.getActionBinding();
        } else if (!libVal.evalIsEmpty(context.binding) && libCom.getPageName(context) !== 'VehicleIssueOrReceiptCreatePage') {
            binding = context.binding;
        } else {
            binding = context.getClientData();
        }

        if (vehicleFlag) {
            if (!libVal.evalIsEmpty(binding.TempLine_MatDocItemReadLink)) {
                // edit material document item
                action = '/SAPAssetManager/Actions/Inventory/IssueOrReceipt/VehicleIssueOrReceiptMaterialDocumentItemSerialNumCreateRelated.action';
            } else if (libVal.evalIsEmpty(binding.TempHeader_MatDocReadLink)) {
                // create material doc item and  material doc  - changeset
                action = '/SAPAssetManager/Actions/Inventory/IssueOrReceipt/VehicleIssueOrReceiptMaterialDocumentItemSerialNumCreate.action';
            } else {
                // create realted material doc item with existing material doc
                action = '/SAPAssetManager/Actions/Inventory/IssueOrReceipt/VehicleIssueOrReceiptMaterialDocumentItemSerialNumCreateRelated.action';
            }
        } else if (!libVal.evalIsEmpty(binding.TempLine_MatDocItemReadLink)) {
            // edit material document item
            action = '/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptMaterialDocumentItemSerialNumCreateRelated.action';
        } else if (libVal.evalIsEmpty(binding.TempHeader_MatDocReadLink)) {
            // create material doc item and  material doc  - changeset
            action = '/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptMaterialDocumentItemSerialNumCreate.action';
        } else {
            // create realted material doc item with existing material doc
            action = '/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptMaterialDocumentItemSerialNumCreateRelated.action';
        }

        if (!libVal.evalIsEmpty(binding.TempLine_SerialNumbers)) {
            if (libVal.evalIsEmpty(addCounter)) {
                addCounter = 0;
            }
            let serialNums = binding.TempLine_SerialNumbers;
            if (addCounter === serialNums.length) {
                return Promise.resolve(true);
            } else {
                binding.TempLine_SerialNumber = serialNums[addCounter].ReturnValue || serialNums[addCounter];
                return context.executeAction(action).then(() => {
                    addCounter = addCounter + 1;
                    return this.createItemSerialNumber(context, addCounter);
                }).catch((err) => {
                    Logger.error(`Error occurred during the creation of Serial Numbers for Document Items: ${err}`);
                    return Promise.reject(false);
                });
            }
        }
        return Promise.resolve(true);
    }

    static deleteItemSerialNumber(context, deleteCounter) {
        let binding;
        let vehicleFlag = EnableMultipleTechnician(context);
        if (!libVal.evalIsEmpty(context.getActionBinding())) {
            binding = context.getActionBinding();
        } else if (!libVal.evalIsEmpty(context.binding) && libCom.getPageName(context) !== 'VehicleIssueOrReceiptCreatePage') {
            binding = context.binding;
        } else {
            binding = context.getClientData();
        }
        if (!libVal.evalIsEmpty(binding.SerialNum) || !libVal.evalIsEmpty(context.binding.SerialNum)) {
            if (libVal.evalIsEmpty(deleteCounter)) {
                deleteCounter = 0;
            }
            let serialNums = binding.SerialNum || context.binding.SerialNum;
            if (deleteCounter === serialNums.length) {
                return Promise.resolve(true);
            } else {
                binding.TempLine_SerialNumber = serialNums[deleteCounter].SerialNum;
                binding.TempLine_SerialNumber_ReadLink = serialNums[deleteCounter]['@odata.readLink'];
                let action = vehicleFlag ? '/SAPAssetManager/Actions/Inventory/IssueOrReceipt/VehicleIssueOrReceiptMaterialDocumentItemSerialNumDelete.action' : '/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptMaterialDocumentItemSerialNumDelete.action';
                return context.executeAction(action).then(() => {
                    deleteCounter = deleteCounter + 1;
                    return this.deleteItemSerialNumber(context, deleteCounter);
                });
            }
        }
        return Promise.resolve(true);
    }

    static updateItemSerialNumber(context) {
        return this.deleteItemSerialNumber(context).then(() => {
            return this.createItemSerialNumber(context);
        });
    }
}
