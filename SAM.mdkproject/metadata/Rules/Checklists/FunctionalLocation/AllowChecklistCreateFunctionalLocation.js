import libCom from '../../Common/Library/CommonLibrary';

export default function AllowChecklistCreateFunctionalLocation(context) {

    var binding = context.binding;

    if (binding && binding['@odata.type'] === '#sap_mobile.MyFunctionalLocation' && libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.CL.Create') === 'Y') {
        return context.count('/SAPAssetManager/Services/AssetManager.service','ChecklistBusObjects', "$filter=FuncLocIdIntern eq '" + binding.FuncLocIdIntern + "'").then(count => {
            if (count < 1) {
                return Promise.resolve(false);
            }
            return Promise.resolve(true);
        });
    } else {
        // Returning Promise.resolve() to maintain same return types
        return Promise.resolve(false);
    }
}
