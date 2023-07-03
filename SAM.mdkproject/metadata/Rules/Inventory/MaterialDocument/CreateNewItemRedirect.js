import libCom from '../../Common/Library/CommonLibrary';
/**
* Should call actions with calling new add goods window depending on the movement and object type
* @param {IClientAPI} context
*/
export default function CreateNewItemRedirect(context) {
    let move = libCom.getStateVariable(context, 'IMMovementType');
    let objectType = libCom.getStateVariable(context, 'IMObjectType');
    if (objectType === 'ADHOC') {
        switch (move) {
            case 'I':
                return context.executeAction({
                    'Name': '/SAPAssetManager/Actions/Inventory/MaterialDocument/OpenAdhocGoodsReceipt.action',
                    'Properties': {
                        'OnSuccess': '/SAPAssetManager/Rules/Inventory/Stock/SetAdhocGoodsIssue.js',
                    },
                });
            case 'T':
            return context.executeAction({
                'Name': '/SAPAssetManager/Actions/Inventory/MaterialDocument/OpenAdhocGoodsReceipt.action',
                'Properties': {
                    'OnSuccess': '/SAPAssetManager/Rules/Inventory/Stock/SetAdhocStockTransfer.js',
                },
            });
            case 'R':
                return context.executeAction('/SAPAssetManager/Actions/Inventory/MaterialDocument/OpenAdhocGoodsReceipt.action');
            default:
                break;
        }
    }
    return false;
}
