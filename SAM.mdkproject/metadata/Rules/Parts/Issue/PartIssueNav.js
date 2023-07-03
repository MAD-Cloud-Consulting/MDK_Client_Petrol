import libCommon from '../../Common/Library/CommonLibrary';
export default function PartIssueNav(context) {

    let binding = context.binding;
    let textItemCode = libCommon.getAppParam(context, 'PART', 'TextItemCategory');
    let action = '/SAPAssetManager/Actions/Parts/PartIssueNotEditableMessage.action';

    //Text items cannot be issued
    if (binding.hasOwnProperty('ItemCategory')) {
        if (binding.ItemCategory !== textItemCode) {
            action = '/SAPAssetManager/Actions/Parts/PartIssueCreateChangeset.action';            
        }
    }
    return context.executeAction(action);
}
