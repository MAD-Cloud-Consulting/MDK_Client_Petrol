import libCom from '../../../Common/Library/CommonLibrary';
import EnableInventoryClerk from '../../../SideDrawer/EnableInventoryClerk';
import EnableMultipleTechnician from '../../../SideDrawer/EnableMultipleTechnician';

export default function SetStockTransfer(context) {
    libCom.setStateVariable(context, 'Temp_MaterialDocumentReadLink','');
    libCom.setStateVariable(context, 'Temp_MaterialDocumentNumber','');
    libCom.setStateVariable(context, 'TempLine_MatDocItemReadLink', '');
    libCom.setStateVariable(context, 'TempLine_MatDocItem', '');
    libCom.setStateVariable(context, 'IMObjectType', 'TRF'); //PO/STO/RES/IN/OUT/ADHOC/MAT/TRF
    libCom.setStateVariable(context, 'IMMovementType', 'I'); //I/R
    if (EnableInventoryClerk(context)) 
        return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptCreateChangeset.action');
    if (EnableMultipleTechnician(context))
        return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/VehicleIssueOrReceiptCreateChangeset.action');
}
