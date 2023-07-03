import common from '../Common/Library/CommonLibrary';

export default function ChecklistListViewNav(context) {

    let binding = context.binding;

    if (binding) {
        return common.navigateOnRead(context.getPageProxy(), '/SAPAssetManager/Actions/Checklists/ChecklistsListViewNav.action', binding['@odata.readLink'], '$expand=AssetCentralObjectLink_Nav');
    }

}
