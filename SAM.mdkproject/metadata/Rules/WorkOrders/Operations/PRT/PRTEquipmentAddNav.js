import libCommon from '../../../Common/Library/CommonLibrary';

export default function PRTEquipmentAddNav(context) {
    //Set the global TransactionType variable to UPDATE
    libCommon.setOnCreateUpdateFlag(context, 'CREATE');

    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/PRT/PRTEquipmentCreateUpdateNav.action');
}
