import libCommon from '../../../../Common/Library/CommonLibrary';

export default function PRTCreateUpdateOnCommit(context) {

    if (libCommon.IsOnCreate(context)) {
        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/PRT/CreateUpdate/PRTEquipmentCreate.action');
    }

    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/PRT/CreateUpdate/PRTEquipmentUpdate.action');
}
