import libCommon from '../../../Common/Library/CommonLibrary';

export default function PRTEquipmentUpdateNav(context) {
    //Set the global TransactionType variable to UPDATE
    libCommon.setOnCreateUpdateFlag(context, 'UPDATE');

    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/PRT/PRTEquipmentCreateUpdateNav.action');
}
