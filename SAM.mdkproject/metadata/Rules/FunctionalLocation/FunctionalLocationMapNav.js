import GetGeometryInformation from '../Common/GetGeometryInformation';
import libCommon from '../Common/Library/CommonLibrary';

export default function FunctionalLocationMapNav(context) {
    if (context.getPageProxy().getClientData().geometry) {
        if (Object.keys(context.getPageProxy().getClientData().geometry).length > 0) {
            context.getPageProxy().setActionBinding(context.getPageProxy().getClientData().geometry);
            return context.executeAction('/SAPAssetManager/Actions/FunctionalLocation/FunctionalLocationMapNav.action');
        }
    } else {
        return GetGeometryInformation(context.getPageProxy(), 'FuncLocGeometries').then(function(value) {
            if (value && Object.keys(value).length > 0) {
                context.getPageProxy().setActionBinding(value);
                // update
                if (libCommon.getPageName(context) === 'FunctionalLocationCreateUpdatePage') {
                    return context.executeAction('/SAPAssetManager/Actions/FunctionalLocation/FunctionalLocationMapUpdateNav.action');
                }
                return context.executeAction('/SAPAssetManager/Actions/FunctionalLocation/FunctionalLocationMapNav.action');
            }
            // create
            if (libCommon.getPageName(context) === 'FunctionalLocationCreateUpdatePage') {
                return context.executeAction('/SAPAssetManager/Actions/FunctionalLocation/FunctionalLocationMapCreateNav.action');
            }
            return null;
        });
    }
}
