export default function FuncLocDetailsNav(context) {

    let binding = context.getPageProxy().getActionBinding();

    if (binding && binding['@odata.readLink']) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'] + '/FuncLoc', [], '').then(function(result) {
            context.getPageProxy().setActionBinding(result.getItem(0));
            return context.executeAction('/SAPAssetManager/Actions/FunctionalLocation/FunctionalLocationDetailsNav.action');
        });
    } else {
        return null;
    }

}
